from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from google.cloud import storage

from app.core.config import settings


class StorageService:
    def __init__(self) -> None:
        self.client = storage.Client(project=settings.google_cloud_project_id)
        self.bucket_name = settings.gcs_bucket_name

    def upload_report_image(
        self,
        image_bytes: bytes,
        original_filename: str,
        mime_type: str,
    ) -> str:
        safe_filename = original_filename.replace(" ", "_")
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        object_name = (
            f"citizen-reports/images/{timestamp}_{uuid4().hex}_{safe_filename}"
        )

        bucket = self.client.bucket(self.bucket_name)
        blob = bucket.blob(object_name)

        blob.upload_from_string(
            image_bytes,
            content_type=mime_type,
        )

        return f"gs://{self.bucket_name}/{object_name}"


storage_service = StorageService()