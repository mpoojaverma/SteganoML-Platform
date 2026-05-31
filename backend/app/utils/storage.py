import os
from pathlib import Path

from supabase import create_client


SUPABASE_URL = os.getenv(
    "SUPABASE_URL"
)

SUPABASE_SERVICE_KEY = os.getenv(
    "SUPABASE_SERVICE_KEY"
)

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_KEY
)


def upload_audio_file(
    file_path: str,
):
    path = Path(file_path)

    storage_name = (
        f"outputs/{path.name}"
    )

    with open(
        path,
        "rb",
    ) as file:

        supabase.storage.from_(
            "audio-files"
        ).upload(
            storage_name,
            file,
            {
                "content-type":
                "audio/wav",
                "upsert": "true",
            },
        )

    public_url = (
        supabase.storage
        .from_("audio-files")
        .get_public_url(
            storage_name
        )
    )

    if isinstance(
        public_url,
        dict,
    ):
        return public_url.get(
            "publicUrl"
        )

    return public_url