from fastapi import (
    APIRouter,
    Query,
)

from app.utils.supabase_logger import (
    get_jobs_supabase,
)

router = APIRouter()


@router.get("/")
async def get_jobs(
    email: str = Query(...)
):
    result = (
        get_jobs_supabase(
            email
        )
    )

    return result.data