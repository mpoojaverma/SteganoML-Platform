import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from app.services.pipeline_service import run_encode_pipeline
from app.utils.supabase_logger import save_job_supabase

router = APIRouter()
BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "temp" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/")
async def encode_audio_route(
    audio_file: UploadFile = File(...),
    secret_message: str = Form(...),
    password: str = Form(...),
    user_email: str = Form(...),
    method: str = Form("ml"),
):
    try:
        unique_filename = f"{uuid.uuid4().hex}_{audio_file.filename}"
        input_audio_path = UPLOAD_DIR / unique_filename

        with open(input_audio_path, "wb") as buffer:
            shutil.copyfileobj(audio_file.file, buffer)

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
            "file_name": audio_file.filename,
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

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{filename}")
async def download_encoded_file(filename: str):
    output_dir = BASE_DIR / "temp" / "outputs"
    file_path = output_dir / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Requested file resource not found.")

    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type="audio/wav",
    )