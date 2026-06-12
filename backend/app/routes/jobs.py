from fastapi import (
    APIRouter,
    Query,
    Request,
)

from app.utils.supabase_logger import (
    get_jobs_supabase,
)
from app.utils.auth import get_authenticated_user

router = APIRouter()


@router.get("/")
async def get_jobs(
    request: Request,
    email: str = Query(None)
):
    user = get_authenticated_user(request)
    result = get_jobs_supabase(user["email"])

    return result.data