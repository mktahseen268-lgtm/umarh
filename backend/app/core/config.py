from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import PostgresDsn, RedisDsn, field_validator
from typing import Literal


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    APP_NAME: str = "Umrah & Hajj Platform API"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    DEBUG: bool = True
    SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION_USE_SECRETS_MANAGER"
    ALLOWED_HOSTS: list[str] = ["*"]

    # Database
    DATABASE_URL: PostgresDsn = "postgresql+asyncpg://postgres:admin@localhost:5432/umrah_db"  # type: ignore[assignment]
    DATABASE_URL_SYNC: str = "postgresql://postgres:admin@localhost:5432/umrah_db"

    # Redis
    REDIS_URL: RedisDsn = "redis://localhost:6379/0"  # type: ignore[assignment]

    # JWT
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    JWT_ALGORITHM: str = "HS256"

    # Storage
    S3_BUCKET: str = "umrah-platform"
    S3_REGION: str = "us-east-1"
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""
    S3_ENDPOINT_URL: str | None = None  # For MinIO / R2

    # Payment gateways
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    # SMS
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_FROM_NUMBER: str = ""

    # Email
    SENDGRID_API_KEY: str = ""
    FROM_EMAIL: str = "noreply@umrahplatform.com"
    FROM_NAME: str = "Umrah & Hajj Platform"

    # Commission
    DEFAULT_COMMISSION_PCT: float = 10.0

    # Rate limiting
    RATE_LIMIT_AUTH: str = "5/minute"
    RATE_LIMIT_SEARCH: str = "60/minute"
    RATE_LIMIT_BOOKING: str = "10/minute"

    # Sentry
    SENTRY_DSN: str | None = None

    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:3005",
        "https://umrahplatform.com",
    ]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"


settings = Settings()
