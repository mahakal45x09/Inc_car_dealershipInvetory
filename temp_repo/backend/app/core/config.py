from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "AutoStock Pro API"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "secret_key_change_me_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # PostgreSQL Database URL by default, fallback to SQLite if needed
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/dealership_db"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
