from fastapi import APIRouter, HTTPException, Response, Request, status, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.deps import DbSession, CurrentUser
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.models.user import User, UserRole
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterIn(BaseModel):
    first_name:   str
    last_name:    str
    email:        EmailStr
    phone:        str | None = None
    password:     str
    country_code: str | None = None


class LoginIn(BaseModel):
    email:    EmailStr
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type:   str = "bearer"


class UserOut(BaseModel):
    id:         str
    email:      str
    first_name: str
    last_name:  str
    status:     str
    preferred_language: str
    roles:      list[str] = []

    model_config = {"from_attributes": True}

    @classmethod
    def from_user(cls, user: "User") -> "UserOut":
        return cls(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            status=user.status,
            preferred_language=user.preferred_language,
            roles=[r.role_name for r in (user.roles or [])],
        )


def _set_auth_cookies(response: Response, access: str, refresh: str) -> None:
    from app.core.config import settings
    secure = settings.is_production
    response.set_cookie("access_token",  access,  httponly=True, samesite="lax", secure=secure, max_age=60 * 30)
    response.set_cookie("refresh_token", refresh, httponly=True, samesite="lax", secure=secure, max_age=60 * 60 * 24 * 30)


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=UserOut)
async def register(body: RegisterIn, response: Response, db: DbSession) -> UserOut:
    existing = await db.execute(select(User).where(User.email == body.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        id=str(uuid.uuid4()),
        email=body.email,
        phone=body.phone,
        password_hash=hash_password(body.password),
        first_name=body.first_name,
        last_name=body.last_name,
        country_code=body.country_code,
        status="pending_verification",
    )
    db.add(user)
    await db.flush()

    role = UserRole(user_id=user.id, role_name="customer")
    db.add(role)
    await db.flush()

    access  = create_access_token(user.id)
    refresh = create_refresh_token(user.id)
    _set_auth_cookies(response, access, refresh)

    # TODO: send email verification via Celery task
    user.roles = [role]
    return UserOut.from_user(user)


@router.post("/login", response_model=UserOut)
async def login(body: LoginIn, response: Response, db: DbSession) -> UserOut:
    result = await db.execute(
        select(User).where(User.email == body.email)
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if user.status == "suspended":
        raise HTTPException(status_code=403, detail="Account suspended")

    access  = create_access_token(user.id)
    refresh = create_refresh_token(user.id)
    _set_auth_cookies(response, access, refresh)
    return UserOut.from_user(user)


@router.post("/logout")
async def logout(response: Response) -> dict:
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out"}


@router.post("/refresh", response_model=UserOut)
async def refresh_token(request: Request, response: Response, db: DbSession) -> UserOut:
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = decode_token(token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")

    result = await db.execute(select(User).where(User.id == payload["sub"]))
    user   = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    access  = create_access_token(user.id)
    refresh = create_refresh_token(user.id)
    _set_auth_cookies(response, access, refresh)
    return UserOut.from_user(user)


@router.get("/me", response_model=UserOut)
async def get_me(current_user: CurrentUser) -> UserOut:
    return UserOut.from_user(current_user)


class ForgotPasswordIn(BaseModel):
    email: EmailStr


@router.post("/forgot-password")
async def forgot_password(body: ForgotPasswordIn, db: DbSession) -> dict:
    result = await db.execute(select(User).where(User.email == body.email))
    user   = result.scalar_one_or_none()
    if user:
        # TODO: create signed reset token and send email via Celery
        pass
    return {"message": "If that email exists, a reset link was sent"}


class ResetPasswordIn(BaseModel):
    token:    str
    password: str


@router.post("/reset-password")
async def reset_password(body: ResetPasswordIn, db: DbSession) -> dict:
    try:
        payload = decode_token(body.token)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    result = await db.execute(select(User).where(User.id == payload["sub"]))
    user   = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password_hash = hash_password(body.password)
    return {"message": "Password updated"}
