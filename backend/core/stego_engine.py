import pickle
import struct
import numpy as np

from pathlib import Path

from core.crypto import (
    encrypt_message,
    decrypt_message
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
    generate_deterministic_positions
)

from core.ml_pipeline import (
    get_ml_guided_positions
)


# =========================================================
# POSITION STORAGE
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

POSITION_DIR = BASE_DIR / "temp" / "positions"

POSITION_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# =========================================================
# HEADER HELPERS
# =========================================================

def create_payload_header(payload_size: int):

    return struct.pack(">I", payload_size)


def parse_payload_header(header_bytes: bytes):

    return struct.unpack(">I", header_bytes)[0]


# =========================================================
# POSITION STORAGE
# =========================================================

def save_positions(position_file, positions):

    with open(position_file, "wb") as f:

        pickle.dump(positions, f)


def load_positions(position_file):

    with open(position_file, "rb") as f:

        return pickle.load(f)


# =========================================================
# ENCODE
# =========================================================

def encode_message(
    input_audio_path: str,
    output_audio_path: str,
    secret_message: str,
    password: str,
    method: str = "ml"
):

    audio_data, sample_rate = load_audio(
        input_audio_path
    )

    original_shape = audio_data.shape

    flat_audio = flatten_audio(audio_data)

    encrypted_payload = encrypt_message(
        append_delimiter(
            secret_message.encode()
        ),
        password
    )

    payload_header = create_payload_header(
        len(encrypted_payload)
    )

    full_payload = payload_header + encrypted_payload

    payload_bits = bytes_to_bits(
        full_payload
    )

    required_bits = len(payload_bits)

    validate_audio_capacity(
        len(flat_audio),
        required_bits
    )

    # -----------------------------------------------------
    # POSITION SELECTION
    # -----------------------------------------------------

    if method == "ml":

        positions = get_ml_guided_positions(
            input_audio_path,
            required_bits,
            password
        )

    else:

        positions = generate_deterministic_positions(
            len(flat_audio),
            required_bits,
            password
        )

    # -----------------------------------------------------
    # SAVE POSITION MAP
    # -----------------------------------------------------

    output_name = Path(
        output_audio_path
    ).stem

    position_file = (
        POSITION_DIR / f"{output_name}.pkl"
    )

    save_positions(
        position_file,
        positions
    )

    # -----------------------------------------------------
    # EMBEDDING
    # -----------------------------------------------------

    modified_audio = np.copy(flat_audio)

    for bit_idx, sample_idx in enumerate(positions):

        modified_audio[sample_idx] = (
            modified_audio[sample_idx] & ~1
        ) | int(payload_bits[bit_idx])

    # -----------------------------------------------------
    # SAVE AUDIO
    # -----------------------------------------------------

    modified_audio = reshape_audio(
        modified_audio,
        original_shape
    )

    save_audio(
        output_audio_path,
        modified_audio,
        sample_rate
    )

    return {
        "status": "success",
        "method": method,
        "bits_embedded": required_bits,
        "output_file": output_audio_path
    }


# =========================================================
# DECODE
# =========================================================

def decode_message(
    audio_path: str,
    password: str,
    method: str = "ml"
):

    audio_data, sample_rate = load_audio(
        audio_path
    )

    flat_audio = flatten_audio(audio_data)

    audio_name = Path(
        audio_path
    ).stem

    position_file = (
        POSITION_DIR / f"{audio_name}.pkl"
    )

    if not position_file.exists():

        return {
            "status": "error",
            "message": "Position map missing."
        }

    positions = load_positions(
        position_file
    )

    # -----------------------------------------------------
    # EXTRACT BITS
    # -----------------------------------------------------

    extracted_bits = ""

    for sample_idx in positions:

        extracted_bits += str(
            flat_audio[sample_idx] & 1
        )

    extracted_bytes = bits_to_bytes(
        extracted_bits
    )

    # -----------------------------------------------------
    # HEADER
    # -----------------------------------------------------

    header_bytes = extracted_bytes[:4]

    payload_size = parse_payload_header(
        header_bytes
    )

    encrypted_payload = extracted_bytes[
        4:4 + payload_size
    ]

    # -----------------------------------------------------
    # DECRYPT
    # -----------------------------------------------------

    try:

        decrypted_payload = decrypt_message(
            encrypted_payload,
            password
        )

        cleaned_payload = remove_delimiter(
            decrypted_payload
        )

        return {
            "status": "success",
            "message": cleaned_payload.decode(
                errors="ignore"
            )
        }

    except Exception as e:

        return {
            "status": "error",
            "message": "Decryption failed.",
            "details": repr(e)
        }