from typing import Annotated
from fastapi import Depends, HTTPException, status, Cookie
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import decode_token
from app.models.user import User

TokenDep = Annotated[AsyncSession, Depends(get_db)]


async def get_current_user(
    db: Annotated[AsyncSession, Depends(get_db)],
    access_token: str | None = Cookie(default=None),
) -> User:
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not access_token:
        raise credentials_exc
    try:
        payload = decode_token(access_token)
    except ValueError:
        raise credentials_exc

    user_id: str | None = payload.get("sub")
    if not user_id:
        raise credentials_exc

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise credentials_exc
    if user.status == "suspended":
        raise HTTPException(status_code=403, detail="Account suspended")
    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    return current_user


async def require_agency_owner(
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> User:
    roles = [r.role_name for r in current_user.roles]
    if "agency_owner" not in roles and "super_admin" not in roles:
        raise HTTPException(status_code=403, detail="Agency owner access required")
    return current_user


async def require_super_admin(
    current_user: Annotated[User, Depends(get_current_active_user)],
) -> User:
    roles = [r.role_name for r in current_user.roles]
    if "super_admin" not in roles:
        raise HTTPException(status_code=403, detail="Super admin access required")
    return current_user


CurrentUser      = Annotated[User, Depends(get_current_active_user)]
AgencyOwnerUser  = Annotated[User, Depends(require_agency_owner)]
SuperAdminUser   = Annotated[User, Depends(require_super_admin)]
DbSession        = Annotated[AsyncSession, Depends(get_db)]
