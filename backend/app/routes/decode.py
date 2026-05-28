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
    run_decode_pipeline
)


router = APIRouter()


# =========================================================
# TEMP DIRECTORY
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent.parent

UPLOAD_DIR = BASE_DIR / "temp" / "uploads"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# =========================================================
# DECODE ROUTE
# =========================================================

@router.post("/")
async def decode_audio_route(
    audio_file: UploadFile = File(...),
    password: str = Form(...),
    method: str = Form("ml")
):
    """
    Extracts hidden payload from audio.
    """

    try:

        # -------------------------------------------------
        # PRESERVE ORIGINAL FILENAME
        # -------------------------------------------------

        input_audio_path = (
            UPLOAD_DIR / audio_file.filename
        )

        with open(input_audio_path, "wb") as buffer:

            shutil.copyfileobj(
                audio_file.file,
                buffer
            )

        # -------------------------------------------------
        # RUN PIPELINE
        # -------------------------------------------------

        result = await run_decode_pipeline(
            input_audio_path=str(input_audio_path),
            password=password,
            method=method
        )

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )