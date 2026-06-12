import uuid
import shutil
import logging
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from app.services.pipeline_service import run_encode_pipeline
from app.utils.supabase_logger import save_job_supabase

router = APIRouter()
BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "temp" / "uploads"
OUTPUT_DIR = BASE_DIR / "temp" / "outputs"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

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
async def encode_audio_route(
    background_tasks: BackgroundTasks,
    audio_file: UploadFile = File(...),
    secret_message: str = Form(...),
    password: str = Form(...),
    user_email: str = Form(...),
    method: str = Form("ml"),
):
    try:
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

        result = await run_encode_pipeline(
            input_audio_path=str(input_audio_path),
            secret_message=secret_message,
            password=password,
            method=method,
        )

        # Map details safely with validation fallbacks
        details = result.get("details", {})
        position_list = list(result.get("position_list", []))
        position_map_str = ",".join(map(str, position_list))

        print(
           "POSITION COUNT:",
            len(position_list)
        )
        
        save_job_supabase({
            "user_email": user_email,
            "type": "encode",
            "file_name": safe_filename,
            "method": method,
            "status": result.get("status", "success"),
            "psnr": float(details.get("psnr", 0.0)),
            "snr": float(details.get("snr", 0.0)),
            "ber": float(details.get("ber", 0.0)),
            "nc": float(details.get("nc", 1.0)),
            "output_file": result.get("filename", ""),
            "storage_url": result.get("storage_url", ""),
            "position_map": position_map_str
        })

        # P1: Temp file cleanup (on success)
        output_filename = result.get("filename")
        output_audio_path = OUTPUT_DIR / output_filename
        background_tasks.add_task(cleanup_temp_files, str(input_audio_path), str(output_audio_path))

        return result

    except HTTPException:
        raise
    except Exception as e:
        # Clean up temp file on failure
        if 'input_audio_path' in locals() and input_audio_path.exists():
            try:
                input_audio_path.unlink()
            except Exception:
                pass
        
        # P1: Exception sanitization
        logger.exception("An error occurred during audio encoding:")
        raise HTTPException(
            status_code=500,
            detail="An internal server error occurred during audio processing."
        )

@router.get("/download/{filename}")
async def download_encoded_file(filename: str):
    output_dir = OUTPUT_DIR.resolve()
    # P0: Path traversal boundary check
    file_path = (output_dir / filename).resolve()

    if not file_path.is_relative_to(output_dir):
        raise HTTPException(status_code=403, detail="Access denied.")

    if file_path.exists():
        return FileResponse(
            path=str(file_path),
            filename=filename,
            media_type="audio/wav",
        )

    # Fallback to Supabase Storage if temp file was cleaned up
    try:
        from app.utils.supabase_logger import supabase
        from fastapi.responses import Response
        
        storage_path = f"outputs/{filename}"
        response_bytes = supabase.storage.from_("audio-files").download(storage_path)
        if response_bytes:
            return Response(
                content=response_bytes,
                media_type="audio/wav",
                headers={
                    "Content-Disposition": f"attachment; filename={filename}"
                }
            )
    except Exception as e:
        logger.error(f"Error downloading {filename} from Supabase: {str(e)}")

    raise HTTPException(status_code=404, detail="Audio file not found.")