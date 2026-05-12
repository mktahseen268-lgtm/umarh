"""Run from backend/ with: .venv\Scripts\python scripts\create_admin.py"""
import asyncio
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select
from app.core.config import settings
from app.core.security import hash_password
from app.models.user import User, UserRole


async def main() -> None:
    engine = create_async_engine(str(settings.DATABASE_URL), echo=False)
    Session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    email = "admin@umrahplatform.com"
    password = "Admin@1234"

    async with Session() as db:
        existing = (await db.execute(select(User).where(User.email == email))).scalar_one_or_none()
        if existing:
            print(f"Admin already exists: {email}")
            await engine.dispose()
            return

        user = User(
            id=str(uuid.uuid4()),
            email=email,
            password_hash=hash_password(password),
            first_name="Super",
            last_name="Admin",
            status="active",
        )
        db.add(user)
        await db.flush()

        db.add(UserRole(id=str(uuid.uuid4()), user_id=user.id, role_name="super_admin"))
        db.add(UserRole(id=str(uuid.uuid4()), user_id=user.id, role_name="customer"))

        await db.commit()
        print(f"Created admin user: {email} / {password}")

    await engine.dispose()


asyncio.run(main())
