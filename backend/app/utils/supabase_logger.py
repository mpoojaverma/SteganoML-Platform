from dotenv import load_dotenv
from supabase import create_client
import os

print("Loading environment...")

load_dotenv()

SUPABASE_URL = os.getenv(
    "SUPABASE_URL"
)

SUPABASE_KEY = os.getenv(
    "SUPABASE_SERVICE_KEY"
)

print("SUPABASE_URL =", SUPABASE_URL)

if SUPABASE_KEY:
    print(
        "SUPABASE_SERVICE_KEY loaded"
    )
else:
    print(
        "SUPABASE_SERVICE_KEY NOT FOUND"
    )

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

print("Supabase client created")


def save_job_supabase(
    job_data: dict
):
    return (
        supabase
        .table("jobs")
        .insert(job_data)
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