from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    google_cloud_project_id: str
    google_cloud_region: str = "asia-south1"
    gemini_model: str = "gemini-2.5-flash"
    bigquery_dataset: str = "community_guardian_ai"
    gcs_bucket_name: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()