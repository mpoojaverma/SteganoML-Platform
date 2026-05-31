import csv

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

CSV_FILE = BASE_DIR / "data" / "job_history.csv"


def generate_csv(jobs):

    CSV_FILE.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(
        CSV_FILE,
        "w",
        newline="",
        encoding="utf-8"
    ) as file:

        writer = csv.writer(file)

        writer.writerow(
            [
                "Timestamp",
                "Type",
                "File",
                "Method",
                "Status",
                "PSNR",
                "SNR",
                "BER",
                "NC",
            ]
        )

        for job in jobs:

            writer.writerow(
                [
                    job.get("timestamp", ""),
                    job.get("type", ""),
                    job.get("file", ""),
                    job.get("method", ""),
                    job.get("status", ""),
                    job.get("psnr", ""),
                    job.get("snr", ""),
                    job.get("ber", ""),
                    job.get("nc", ""),
                ]
            )

    return CSV_FILE