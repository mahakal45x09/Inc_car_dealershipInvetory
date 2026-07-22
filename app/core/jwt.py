from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import jwt

from app.core.config import settings


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a new JWT access token.

    Args:
        data: The payload data to encode in the token.
        expires_delta: Optional custom expiration time.

    Returns:
        The encoded JWT string.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )
    return encoded_jwt


def verify_access_token(token: str) -> dict:
    """
    Verify a JWT token and return its payload.

    Args:
        token: The JWT string to verify.

    Returns:
        The decoded payload dictionary.

    Raises:
        ExpiredSignatureError: If the token has expired.
        JWTError: If the token is invalid.
    """
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
