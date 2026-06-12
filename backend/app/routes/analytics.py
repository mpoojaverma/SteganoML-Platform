from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Query, Request
from app.utils.supabase_logger import get_jobs_supabase, supabase
from app.utils.auth import get_authenticated_user

router = APIRouter()


@router.get("/")
async def get_analytics(
    request: Request,
    email: str = Query(None),
    owner_id: Optional[str] = Query(None)
):
    user = get_authenticated_user(request)
    email = user["email"]
    owner_id = user["id"]
    
    result = get_jobs_supabase(email)

    jobs = result.data or []

    encode_jobs = [
        j for j in jobs
        if j["type"] == "encode"
    ]

    decode_jobs = [
        j for j in jobs
        if j["type"] == "decode"
    ]

    successful_jobs = [
        j for j in jobs
        if j["status"] == "success"
    ]

    avg_psnr = (
        sum(
            float(j["psnr"])
            for j in encode_jobs
            if j["psnr"] is not None
        )
        / max(
            len(
                [
                    j
                    for j in encode_jobs
                    if j["psnr"] is not None
                ]
            ),
            1,
        )
    )

    avg_snr = (
        sum(
            float(j["snr"])
            for j in encode_jobs
            if j["snr"] is not None
        )
        / max(
            len(
                [
                    j
                    for j in encode_jobs
                    if j["snr"] is not None
                ]
            ),
            1,
        )
    )

    # Share statistics initialization
    links_created = 0
    files_shared = 0
    downloads_completed = 0
    expired_links = 0

    if owner_id:
        try:
            shares_res = supabase.table("shared_files").select("*").eq("owner_id", owner_id).execute()
            shares = shares_res.data or []
            links_created = len(shares)
            files_shared = len(set(s["file_name"] for s in shares))
            downloads_completed = sum(s["download_count"] for s in shares)
            
            now = datetime.now(timezone.utc)
            for s in shares:
                expires_at = datetime.fromisoformat(s["expires_at"].replace("Z", "+00:00"))
                if s["status"] == "expired" or expires_at < now:
                    expired_links += 1
        except Exception:
            pass

    return {
        "total_jobs": len(jobs),
        "encode_jobs": len(encode_jobs),
        "decode_jobs": len(decode_jobs),
        "successful_jobs": len(
            successful_jobs
        ),
        "average_psnr": round(
            avg_psnr, 2
        ),
        "average_snr": round(
            avg_snr, 2
        ),
        "links_created": links_created,
        "files_shared": files_shared,
        "downloads_completed": downloads_completed,
        "expired_links": expired_links,
    }