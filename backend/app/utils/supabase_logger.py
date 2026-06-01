from dotenv import load_dotenv
from supabase import create_client
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


def save_job_supabase(job_data: dict):
    return (
        supabase
        .table("jobs")
        .insert(job_data)
        .execute()
    )


def update_position_map(
    output_file: str,
    position_map: str,
):
    return (
        supabase
        .table("jobs")
        .update(
            {
                "position_map": position_map
            }
        )
        .eq(
            "output_file",
            output_file
        )
        .execute()
    )


def get_jobs_supabase(
    user_email: str
):
    return (
        supabase
        .table("jobs")
        .select("*")
        .eq(
            "user_email",
            user_email
        )
        .order(
            "created_at",
            desc=True
        )
        .execute()
    )