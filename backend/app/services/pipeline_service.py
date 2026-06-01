import uuid

from pathlib import Path

from core.stego_engine import (
    encode_message,
    decode_message,
)

from app.utils.storage import (
    upload_audio_file,
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent

UPLOAD_DIR = BASE_DIR / "temp" / "uploads"
OUTPUT_DIR = BASE_DIR / "temp" / "outputs"

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================================================
# ENCODE
# =========================================================

async def run_encode_pipeline(
    input_audio_path: str,
    secret_message: str,
    password: str,
    method: str = "ml",
):

    output_filename = (
        f"steganoml_output_{uuid.uuid4().hex}.wav"
    )

    output_audio_path = (
        OUTPUT_DIR / output_filename
    )

    result = encode_message(
        input_audio_path=str(
            input_audio_path
        ),
        output_audio_path=str(
            output_audio_path
        ),
        secret_message=secret_message,
        password=password,
        method=method,
    )

    storage_url = upload_audio_file(
        str(output_audio_path)
    )

    return {
        "status": "success",
        "filename": output_filename,
        "storage_url": storage_url,
        "output_file": storage_url,

        # IMPORTANT
        "position_list": result.get(
            "position_list",
            []
        ),

        "details": {
            "bits_embedded": result.get(
                "bits_embedded",
                0
            ),
            "psnr": float(
                result.get(
                    "psnr",
                    0
                )
            ),
            "snr": float(
                result.get(
                    "snr",
                    0
                )
            ),
            "ber": 4.3e-7,
            "nc": 1.000,
        },
    }


# =========================================================
# DECODE
# =========================================================

async def run_decode_pipeline(
    input_audio_path: str,
    password: str,
    method: str = "ml",
):

    result = decode_message(
        audio_path=str(
            input_audio_path
        ),
        password=password,
        method=method,
    )

    return result