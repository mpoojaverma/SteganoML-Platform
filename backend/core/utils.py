import random
import numpy as np
import soundfile as sf


# =========================================================
# AUDIO LOADING
# =========================================================

def load_audio(audio_path: str):

    audio_data, sample_rate = sf.read(
        audio_path,
        dtype='int16'
    )

    return audio_data, sample_rate


# =========================================================
# AUDIO SAVING
# =========================================================

def save_audio(output_path: str, audio_data, sample_rate: int):

    sf.write(
        output_path,
        audio_data,
        sample_rate,
        subtype='PCM_16'
    )


# =========================================================
# BYTE CONVERSIONS
# =========================================================

def bytes_to_bits(data: bytes) -> str:

    return ''.join(
        format(byte, '08b')
        for byte in data
    )


def bits_to_bytes(bits: str) -> bytes:

    byte_array = bytearray()

    for i in range(0, len(bits), 8):

        byte_chunk = bits[i:i + 8]

        if len(byte_chunk) == 8:

            byte_array.append(
                int(byte_chunk, 2)
            )

    return bytes(byte_array)


# =========================================================
# PAYLOAD HELPERS
# =========================================================

def append_delimiter(data: bytes) -> bytes:

    delimiter = b"###END###"

    return data + delimiter


def remove_delimiter(data: bytes) -> bytes:

    delimiter = b"###END###"

    return data.split(delimiter)[0]


# =========================================================
# POSITION GENERATION
# =========================================================

def generate_deterministic_positions(
    total_samples: int,
    required_bits: int,
    password: str
):

    if required_bits > total_samples:

        raise ValueError(
            "Payload too large."
        )

    seed = sum(ord(c) for c in password)

    rng = random.Random(seed)

    positions = rng.sample(
        range(total_samples),
        required_bits
    )

    return positions


# =========================================================
# VALIDATION
# =========================================================

def validate_audio_capacity(
    total_samples: int,
    payload_bits: int
):

    if payload_bits > total_samples:

        raise ValueError(
            "Payload exceeds audio capacity."
        )


# =========================================================
# ARRAY HELPERS
# =========================================================

def flatten_audio(audio_data):

    if len(audio_data.shape) > 1:

        return audio_data.flatten()

    return audio_data


def reshape_audio(flat_audio, original_shape):

    return flat_audio.reshape(
        original_shape
    )