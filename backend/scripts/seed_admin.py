"""
Create a super_admin user for local development.
Usage: python scripts/seed_admin.py
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.core.config import settings
from app.core.security import hash_password
from app.models.user import User, UserRole
import uuid

ADMIN_EMAIL    = "admin@umrahplatform.com"
ADMIN_PASSWORD = "Admin@1234"


async def seed() -> None:
    engine = create_async_engine(str(settings.DATABASE_URL), echo=False)
    Session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with Session() as session:
        existing = (await session.execute(
            select(User).where(User.email == ADMIN_EMAIL)
        )).scalar_one_or_none()

        if existing:
            print(f"Admin already exists: {ADMIN_EMAIL}")
            await engine.dispose()
            return

        user = User(
            id=str(uuid.uuid4()),
            email=ADMIN_EMAIL,
            password_hash=hash_password(ADMIN_PASSWORD),
            first_name="Super",
            last_name="Admin",
            status="active",
        )
        session.add(user)
        await session.flush()

        role = UserRole(user_id=user.id, role_name="super_admin")
        session.add(role)

        await session.commit()
        print(f"Created admin: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
