import json
from pathlib import Path
from datetime import datetime


BASE_DIR = Path(__file__).resolve().parent.parent.parent

JOB_FILE = (
    BASE_DIR
    / "data"
    / "job_history.json"
)


def get_jobs():

    JOB_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    if not JOB_FILE.exists():

        with open(
            JOB_FILE,
            "w"
        ) as f:

            json.dump([], f)

        return []

    try:

        with open(
            JOB_FILE,
            "r"
        ) as f:

            return json.load(f)

    except Exception:

        return []


def save_job(job_data: dict):

    jobs = get_jobs()

    jobs.insert(
        0,
        {
            "timestamp": datetime.now().isoformat(),
            **job_data,
        }
    )

    with open(
        JOB_FILE,
        "w"
    ) as f:

        json.dump(
            jobs,
            f,
            indent=2
        )