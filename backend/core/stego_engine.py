import struct
import json
import numpy as np
import base64
from pathlib import Path

from cryptography.fernet import InvalidToken
from core.crypto import (
    encrypt_message,
    decrypt_message,
)

from core.utils import (
    load_audio,
    save_audio,
    bytes_to_bits,
    bits_to_bytes,
    append_delimiter,
    remove_delimiter,
    flatten_audio,
    reshape_audio,
    validate_audio_capacity,
    generate_deterministic_positions,
)

from core.ml_pipeline import (
    get_ml_guided_positions,
)

from app.utils.metrics import (
    calculate_psnr,
    calculate_snr,
)

# Reference global client securely
from app.utils.supabase_logger import supabase

BASE_DIR = Path(__file__).resolve().parent.parent
BITSTREAM_DIR = BASE_DIR / "temp" / "bitstreams"
BITSTREAM_DIR.mkdir(parents=True, exist_ok=True)

def create_payload_header(payload_size: int):
    return struct.pack(">I", payload_size)

def parse_payload_header(header_bytes: bytes):
    return struct.unpack(">I", header_bytes)[0]

def save_positions_to_db(output_name: str, positions: list):
    """Persists position maps dynamically into Supabase to prevent loss on stateless instances."""
    try:
        pos_string = ",".join(map(str, positions))
        supabase.table("jobs").update({"position_map": pos_string}).eq("output_file", f"{output_name}.wav").execute()
    except Exception as e:
        print(f"[WARN] Non-blocking position logging error: {str(e)}")

def load_positions_from_db(audio_name: str):
    """Retrieves coordinates from the persistent store with descending date ordering."""
    try:
        response = (
            supabase.table("jobs")
            .select("position_map")
            .or_(f"output_file.eq.{audio_name}.wav,file_name.eq.{audio_name}.wav")
            .order("created_at", desc=True)
            .execute()
        )
        if response.data and response.data[0].get("position_map"):
            pos_str = response.data[0]["position_map"]
            return [int(x) for x in pos_str.split(",") if x.strip()]
    except Exception as e:
        print(f"[WARN] DB retrieval error: {str(e)}")
    return None

def encode_message(
    input_audio_path: str,
    output_audio_path: str,
    secret_message: str,
    password: str,
    method: str = "ml",
):
    audio_data, sample_rate = load_audio(input_audio_path)
    original_shape = audio_data.shape
    flat_audio = flatten_audio(audio_data)

    encrypted_payload = encrypt_message(
        append_delimiter(secret_message.encode()),
        password,
    )

    payload_header = create_payload_header(len(encrypted_payload))
    full_payload = payload_header + encrypted_payload
    payload_bits = bytes_to_bits(full_payload)
    required_bits = len(payload_bits)

    validate_audio_capacity(len(flat_audio), required_bits)

    if method == "ml":
        try:
            positions = get_ml_guided_positions(input_audio_path, required_bits, password)
        except Exception:
            positions = generate_deterministic_positions(len(flat_audio), required_bits, password)
    else:
        positions = generate_deterministic_positions(len(flat_audio), required_bits, password)

    output_name = Path(output_audio_path).stem

    # Core execution loop ensuring array bounds protection
    modified_audio = np.copy(flat_audio)
    for bit_idx, sample_idx in enumerate(positions):
        if sample_idx < len(modified_audio):
            modified_audio[sample_idx] = (modified_audio[sample_idx] & ~1) | int(payload_bits[bit_idx])

    modified_audio = reshape_audio(modified_audio, original_shape)
    save_audio(output_audio_path, modified_audio, sample_rate)

    psnr = calculate_psnr(audio_data, modified_audio)
    snr = calculate_snr(audio_data, modified_audio)

    # Deferred sync initialization to ensure runtime references resolve smoothly
    save_positions_to_db(output_name, positions)

    return {
        "status": "success",
        "method": method,
        "bits_embedded": required_bits,
        "output_file": output_audio_path,
        "psnr": float(psnr),
        "snr": float(snr),
        "position_list": positions
    }

def decode_message(
    audio_path: str,
    password: str,
    method: str = "ml",
):
    try:
        audio_data, sample_rate = load_audio(audio_path)
    except Exception as e:
        return {
            "status": "error",
            "error_type": "UNSUPPORTED_AUDIO_FORMAT",
            "message": "The selected audio format is not supported or the file is corrupted.",
            "details": repr(e),
        }

    flat_audio = flatten_audio(audio_data)
    audio_name = Path(audio_path).stem

    # P0 Upload filename isolation fix: Strip the 32-character hex UUID prefix if present
    parts = audio_name.split("_", 1)
    if len(parts) > 1 and len(parts[0]) == 32:
        try:
            int(parts[0], 16)
            audio_name = parts[1]
        except ValueError:
            pass

    print(f"[DEBUG-DECODE] Stage 0: Loaded audio. Size: {len(flat_audio)} samples.")
    print(f"[DEBUG-DECODE] Stage 1: Normalized audio_name for DB matching: {audio_name}")

    # Calculated placeholder length matching typical stego headers (32 bits size + 1024 baseline)
    estimated_bits = min(len(flat_audio), 32 + (256 * 8))
    
    positions = load_positions_from_db(audio_name)
    from_db = positions is not None
    print(f"[DEBUG-DECODE] Stage 2: Database coordinate lookup? {from_db}. Position count: {len(positions) if from_db else 0}")
    
    if not from_db:
        # Fallback to local recalculation
        if method == "ml":
            try:
                print("[DEBUG-DECODE] Stage 2.1: Running ML fallback feature extraction...")
                positions = get_ml_guided_positions(audio_path, estimated_bits, password)
            except Exception as e:
                print(f"[DEBUG-DECODE] Stage 2.1: ML guided fallback failed: {str(e)}")
                positions = generate_deterministic_positions(len(flat_audio), estimated_bits, password)
        else:
            print("[DEBUG-DECODE] Stage 2.2: Running deterministic Randomized-LSB position generation...")
            positions = generate_deterministic_positions(len(flat_audio), estimated_bits, password)
    
    print(f"[DEBUG-DECODE] Stage 3: Position reconstruction complete. Coordinates count: {len(positions) if positions else 0}")

    if not positions:
        print("[DEBUG-DECODE] Stage 3: Error - Position list is empty.")
        return {
            "status": "error",
            "error_type": "EXTRACTION_FAILURE",
            "message": "Decoding coordinate parameters could not be resolved.",
        }

    extracted_bits = ""
    for sample_idx in positions:
        if sample_idx < len(flat_audio):
            extracted_bits += str(flat_audio[sample_idx] & 1)
    print(f"[DEBUG-DECODE] Stage 4: Bit extraction complete. Extracted bits count: {len(extracted_bits)}")

    try:
        extracted_bytes = bits_to_bytes(extracted_bits)
        print(f"[DEBUG-DECODE] Stage 5: Payload assembly. Assembled raw bytes count: {len(extracted_bytes)}")
        if len(extracted_bytes) < 4:
            raise ValueError("No Embedded Payload Found")
            
        header_bytes = extracted_bytes[:4]
        payload_size = parse_payload_header(header_bytes)
        print(f"[DEBUG-DECODE] Stage 6: Header parsing. Parsed payload size from header: {payload_size} bytes")
        
        # Sanity check: if payload size is obviously invalid or exceeds audio capacity, it's not a stego file
        if payload_size * 8 > len(flat_audio):
            print(f"[DEBUG-DECODE] Stage 6: Error - Parsed payload size ({payload_size} bytes) exceeds capacity ({len(flat_audio) // 8} bytes)")
            raise ValueError("No Embedded Payload Found")
        
        if payload_size + 4 > len(extracted_bytes):
            if from_db:
                print(f"[DEBUG-DECODE] Stage 7: Error - Payload size ({payload_size} + 4) exceeds DB positions length ({len(extracted_bytes)})")
                raise ValueError("Payload size specified in header exceeds available DB coordinates.")
                
            # Recalculate and scale up allocation mapping adaptively if header indicates larger stream
            adjusted_bits = 32 + (payload_size * 8)
            print(f"[DEBUG-DECODE] Stage 7.1: Adaptive scaling required. Recalculating {adjusted_bits} positions...")
            if method == "ml":
                try:
                    positions = get_ml_guided_positions(audio_path, adjusted_bits, password)
                except Exception:
                    positions = generate_deterministic_positions(len(flat_audio), adjusted_bits, password)
            else:
                positions = generate_deterministic_positions(len(flat_audio), adjusted_bits, password)
                
            extracted_bits = "".join([str(flat_audio[idx] & 1) for idx in positions if idx < len(flat_audio)])
            extracted_bytes = bits_to_bytes(extracted_bits)
            encrypted_payload = extracted_bytes[4 : 4 + payload_size]
        else:
            encrypted_payload = extracted_bytes[4 : 4 + payload_size]

        print(f"[DEBUG-DECODE] Stage 8: Fernet decrypting payload of size {len(encrypted_payload)}...")
        decrypted_payload = decrypt_message(encrypted_payload, password)
        cleaned_payload = remove_delimiter(decrypted_payload)
        print(f"[DEBUG-DECODE] Stage 9: Success! Delimiter removed. Decrypted message length: {len(cleaned_payload)}")

        return {
            "status": "success",
            "message": cleaned_payload.decode(errors="ignore"),
        }
    except InvalidToken as e:
        print("[DEBUG-DECODE] Stage 8: Error - Fernet decrypt failed with InvalidToken.")
        return {
            "status": "error",
            "error_type": "WRONG_PASSWORD_OR_MODIFIED_AUDIO",
            "message": "The supplied password is incorrect, or the uploaded audio appears to have been modified after encoding.",
            "details": repr(e),
        }
    except Exception as e:
        print("[DEBUG-DECODE] Stage 8/9: Decode error:", str(e))
        err_msg = str(e)
        error_type = "EXTRACTION_FAILURE"
        if "No Embedded Payload Found" in err_msg:
            error_type = "NO_EMBEDDED_PAYLOAD"
            err_msg = "No valid hidden payload was detected in the audio file."
        
        return {
            "status": "error",
            "error_type": error_type,
            "message": err_msg,
            "details": repr(e),
        }