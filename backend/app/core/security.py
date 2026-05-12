from datetime import datetime, timedelta, timezone
from typing import Any
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def _make_token(data: dict[str, Any], expires_delta: timedelta) -> str:
    payload = data.copy()
    payload["exp"] = datetime.now(tz=timezone.utc) + expires_delta
    payload["iat"] = datetime.now(tz=timezone.utc)
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_access_token(subject: str, extra: dict[str, Any] | None = None) -> str:
    data: dict[str, Any] = {"sub": subject, "type": "access"}
    if extra:
        data.update(extra)
    return _make_token(data, timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES))


def create_refresh_token(subject: str) -> str:
    return _make_token(
        {"sub": subject, "type": "refresh"},
        timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS),
    )


def decode_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError as exc:
        raise ValueError("Invalid or expired token") from exc


def encrypt_pii(plaintext: str) -> str:
    """AES-256-GCM encryption for PII fields — stub; wire to KMS in production."""
    # TODO: replace with aws_encryption_sdk or cryptography.hazmat.primitives.ciphers.aead
    import base64
    return base64.b64encode(plaintext.encode()).decode()


def decrypt_pii(ciphertext: str) -> str:
    """Decrypt PII encrypted with encrypt_pii."""
    import base64
    return base64.b64decode(ciphertext.encode()).decode()
