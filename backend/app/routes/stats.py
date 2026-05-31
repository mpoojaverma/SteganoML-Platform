from fastapi import APIRouter, Query

from app.utils.supabase_logger import (
    get_jobs_supabase,
)

router = APIRouter()


@router.get("/")
async def get_stats(
    email: str = Query(...)
):
    result = get_jobs_supabase(
        email
    )

    jobs = result.data or []

    total_jobs = len(jobs)

    encodes = len(
        [
            j
            for j in jobs
            if j.get("type") == "encode"
        ]
    )

    decodes = len(
        [
            j
            for j in jobs
            if j.get("type") == "decode"
        ]
    )

    successful = len(
        [
            j
            for j in jobs
            if j.get("status") == "success"
        ]
    )

    success_rate = (
        round(
            successful
            / total_jobs
            * 100,
            2,
        )
        if total_jobs > 0
        else 0
    )

    psnr_values = [
        j["psnr"]
        for j in jobs
        if j.get("psnr") is not None
    ]

    snr_values = [
        j["snr"]
        for j in jobs
        if j.get("snr") is not None
    ]

    avg_psnr = (
        round(
            sum(psnr_values)
            / len(psnr_values),
            2,
        )
        if psnr_values
        else 0
    )

    avg_snr = (
        round(
            sum(snr_values)
            / len(snr_values),
            2,
        )
        if snr_values
        else 0
    )

    return {
        "total_jobs": total_jobs,
        "encodes": encodes,
        "decodes": decodes,
        "success_rate": success_rate,
        "avg_psnr": avg_psnr,
        "avg_snr": avg_snr,
    }