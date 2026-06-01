import struct
import json
import numpy as np
import base64
from pathlib import Path

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

def load_positions_from_db(audio_name: str, flat_audio_len: int, required_bits: int, password: str, method: str):
    """Retrieves coordinates from the persistent store with deterministic recalculation fallback."""
    try:
        response = supabase.table("jobs").select("position_map", "method").or_(f"output_file.eq.{audio_name}.wav,file_name.eq.{audio_name}.wav").execute()
        if response.data and response.data[0].get("position_map"):
            pos_str = response.data[0]["position_map"]
            return [int(x) for x in pos_str.split(",") if x.strip()]
    except Exception as e:
        print(f"[WARN] DB retrieval error, utilizing deterministic generation fallback: {str(e)}")
    
    if method == "ml":
        return generate_deterministic_positions(flat_audio_len, required_bits, password)
    return generate_deterministic_positions(flat_audio_len, required_bits, password)

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
    audio_data, sample_rate = load_audio(audio_path)
    flat_audio = flatten_audio(audio_data)
    audio_name = Path(audio_path).stem

    # Calculated placeholder length matching typical stego headers (32 bits size + 1024 baseline)
    estimated_bits = min(len(flat_audio), 32 + (256 * 8))
    
    positions = load_positions_from_db(audio_name, len(flat_audio), estimated_bits, password, method)
    
    if not positions:
        return {
            "status": "error",
            "message": "Decoding coordinate parameters could not be resolved.",
        }

    extracted_bits = ""
    for sample_idx in positions:
        if sample_idx < len(flat_audio):
            extracted_bits += str(flat_audio[sample_idx] & 1)

    try:
        extracted_bytes = bits_to_bytes(extracted_bits)
        if len(extracted_bytes) < 4:
            raise ValueError("Insufficient bitstream lengths.")
            
        header_bytes = extracted_bytes[:4]
        payload_size = parse_payload_header(header_bytes)
        
        if payload_size + 4 > len(extracted_bytes):
            # Recalculate and scale up allocation mapping adaptively if header indicates larger stream
            adjusted_bits = 32 + (payload_size * 8)
            positions = load_positions_from_db(audio_name, len(flat_audio), adjusted_bits, password, method)
            extracted_bits = "".join([str(flat_audio[idx] & 1) for idx in positions if idx < len(flat_audio)])
            extracted_bytes = bits_to_bytes(extracted_bits)
            encrypted_payload = extracted_bytes[4 : 4 + payload_size]
        else:
            encrypted_payload = extracted_bytes[4 : 4 + payload_size]

        decrypted_payload = decrypt_message(encrypted_payload, password)
        cleaned_payload = remove_delimiter(decrypted_payload)

        return {
            "status": "success",
            "message": cleaned_payload.decode(errors="ignore"),
        }
    except Exception as e:
        return {
            "status": "error",
            "message": "Decryption failed. Invalid credentials or corrupted bitstream payload structural integrity.",
            "details": repr(e),
        }