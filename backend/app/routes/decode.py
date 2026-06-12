import shutil
import uuid
import logging
from pathlib import Path
from typing import Optional

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    HTTPException,
    BackgroundTasks,
    Request,
    Response,
)

from app.services.pipeline_service import (
    run_decode_pipeline,
)

from app.utils.supabase_logger import (
    save_job_supabase,
)
from app.utils.auth import get_optional_authenticated_user

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "temp" / "uploads"

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

logger = logging.getLogger("uvicorn.error")

def cleanup_temp_files(*paths: str):
    for path in paths:
        try:
            p = Path(path)
            if p.exists():
                p.unlink()
        except Exception as e:
            logger.warning(f"Error deleting temp file {path}: {str(e)}")

@router.post("/")
async def decode_audio_route(
    request: Request,
    response: Response,
    background_tasks: BackgroundTasks,
    audio_file: UploadFile = File(...),
    password: str = Form(...),
    user_email: Optional[str] = Form(None),
    method: str = Form("ml"),
):
    try:
        # Enforce Cache-Control response headers
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
        response.headers["Pragma"] = "no-cache"

        # P1: Enforce parameter validation limits
        if len(password) > 128:
            raise HTTPException(status_code=400, detail="Password exceeds the maximum length of 128 characters.")

        # P1: Optional user identity verification
        authenticated_user = get_optional_authenticated_user(request)

        # P1: Backend MIME & format validation
        allowed_types = [
            "audio/wav", "audio/x-wav", "audio/mpeg", "audio/mp3",
            "audio/ogg", "audio/flac", "audio/aac", "audio/m4a",
            "audio/x-m4a"
        ]
        file_ext = Path(audio_file.filename).suffix.lower()
        allowed_extensions = [".wav", ".mp3", ".flac", ".m4a", ".ogg", ".aac"]

        if audio_file.content_type not in allowed_types and file_ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Invalid audio file format.")

        # P0: Path traversal protection
        safe_filename = Path(audio_file.filename).name
        unique_filename = f"{uuid.uuid4().hex}_{safe_filename}"
        input_audio_path = UPLOAD_DIR / unique_filename

        # P1: File size validation (100MB max) during async chunked read
        MAX_SIZE = 100 * 1024 * 1024
        total_bytes = 0
        with open(input_audio_path, "wb") as buffer:
            while True:
                chunk = await audio_file.read(1024 * 1024)
                if not chunk:
                    break
                total_bytes += len(chunk)
                if total_bytes > MAX_SIZE:
                    buffer.close()
                    if input_audio_path.exists():
                        input_audio_path.unlink()
                    raise HTTPException(status_code=413, detail="File size exceeds the 100MB limit.")
                buffer.write(chunk)

        result = await run_decode_pipeline(
            input_audio_path=str(
                input_audio_path
            ),
            password=password,
            method=method,
        )

        # Save metrics only for authenticated users (public demo skips logging)
        if authenticated_user:
            save_job_supabase(
                {
                    "user_email": authenticated_user["email"],
                    "type": "decode",
                    "file_name": safe_filename,
                    "method": method,
                    "status": result.get(
                        "status",
                        "success",
                    ),
                }
            )

        # P1: Temp file cleanup (on success/completion)
        background_tasks.add_task(cleanup_temp_files, str(input_audio_path))

        return result

    except HTTPException:
        # Re-raise HTTPExceptions directly to preserve status code and detail
        raise
    except Exception as e:
        # Clean up temp file on failure
        if 'input_audio_path' in locals() and input_audio_path.exists():
            try:
                input_audio_path.unlink()
            except Exception:
                pass
        
        # P1: Exception sanitization
        logger.exception("An error occurred during audio decoding:")
        raise HTTPException(
            status_code=500,
            detail="An internal server error occurred during audio processing."
        )