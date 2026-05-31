# backend/routes/analytics.py

from fastapi import APIRouter, Query
from app.utils.supabase_logger import get_jobs_supabase

router = APIRouter()


@router.get("/")
async def get_analytics(
    email: str = Query(...)
):
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
    }