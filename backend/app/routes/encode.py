import os
import uuid
import shutil

from pathlib import Path

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException
)

from app.services.pipeline_service import (
    run_encode_pipeline
)


router = APIRouter()


# =========================================================
# TEMP DIRECTORY
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent.parent

UPLOAD_DIR = BASE_DIR / "temp" / "uploads"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# =========================================================
# ENCODE ROUTE
# =========================================================

@router.post("/")
async def encode_audio_route(
    audio_file: UploadFile = File(...),
    secret_message: str = Form(...),
    password: str = Form(...),
    method: str = Form("ml")
):
    """
    Encodes secret payload into uploaded audio.
    """

    try:

        # -------------------------------------------------
        # SAVE UPLOADED AUDIO
        # -------------------------------------------------

        unique_filename = (
            f"{uuid.uuid4().hex}_{audio_file.filename}"
        )

        input_audio_path = (
            UPLOAD_DIR / unique_filename
        )

        with open(input_audio_path, "wb") as buffer:
            shutil.copyfileobj(
                audio_file.file,
                buffer
            )

        # -------------------------------------------------
        # RUN PIPELINE
        # -------------------------------------------------

        result = await run_encode_pipeline(
            input_audio_path=str(input_audio_path),
            secret_message=secret_message,
            password=password,
            method=method
        )

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )