"""
Seed a demo agency with owner user and sample packages.
Usage: python scripts/seed_agency.py
"""
import asyncio, sys, os, uuid, re
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.core.config import settings
from app.core.security import hash_password
from app.models.user import User, UserRole
from app.models.agency import Agency, AgencyStaff
from app.models.catalog import Package

AGENCY_EMAIL  = "agency@haramview.com"
OWNER_EMAIL   = "owner@haramview.com"
OWNER_PASS    = "Agency@1234"

SAMPLE_PACKAGES = [
    {
        "title_en": "7-Day Umrah Standard",
        "title_ar": "عمرة قياسية ٧ أيام",
        "summary_en": "A complete Umrah package covering all the essential rituals.",
        "category": "umrah",
        "duration_days": 7,
        "base_price": 1200.0,
        "currency": "USD",
    },
    {
        "title_en": "10-Day Premium VIP Umrah",
        "title_ar": "عمرة بريميوم VIP ١٠ أيام",
        "summary_en": "Luxury Umrah experience with 5-star hotels near Haram.",
        "category": "umrah",
        "duration_days": 10,
        "base_price": 3800.0,
        "currency": "USD",
    },
    {
        "title_en": "Family Umrah Package",
        "title_ar": "باقة عمرة عائلية",
        "summary_en": "Tailored for families with children — group discount included.",
        "category": "umrah",
        "duration_days": 8,
        "base_price": 2200.0,
        "currency": "USD",
    },
    {
        "title_en": "Hajj Preparation 2025",
        "title_ar": "التحضير للحج ٢٠٢٥",
        "summary_en": "Full Hajj package with training sessions and guided rituals.",
        "category": "hajj",
        "duration_days": 12,
        "base_price": 4500.0,
        "currency": "USD",
    },
    {
        "title_en": "5-Day Madinah Ziyarah",
        "title_ar": "زيارة المدينة المنورة ٥ أيام",
        "summary_en": "Visit the Prophet's Mosque and key historical sites in Madinah.",
        "category": "ziyarah",
        "duration_days": 5,
        "base_price": 850.0,
        "currency": "USD",
    },
]


async def seed() -> None:
    engine = create_async_engine(str(settings.DATABASE_URL), echo=False)
    Session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with Session() as db:
        # ── Agency ──────────────────────────────────────────────
        existing_agency = (await db.execute(
            select(Agency).where(Agency.email == AGENCY_EMAIL)
        )).scalar_one_or_none()

        if existing_agency:
            print(f"Agency already exists: {AGENCY_EMAIL}")
            agency = existing_agency
        else:
            agency = Agency(
                id=str(uuid.uuid4()),
                slug="haram-view-travels",
                legal_name="Haram View Travel & Tourism Co.",
                trade_name="Haram View Travels",
                email=AGENCY_EMAIL,
                phone="+966501234567",
                country="SA",
                license_number="HJ-2024-001",
                status="approved",
                commission_rate=8.0,
            )
            db.add(agency)
            await db.flush()
            print(f"Created agency: {agency.trade_name} (id={agency.id})")

        # ── Agency owner user ────────────────────────────────────
        existing_owner = (await db.execute(
            select(User).where(User.email == OWNER_EMAIL)
        )).scalar_one_or_none()

        if existing_owner:
            print(f"Owner already exists: {OWNER_EMAIL}")
            owner = existing_owner
        else:
            owner = User(
                id=str(uuid.uuid4()),
                email=OWNER_EMAIL,
                password_hash=hash_password(OWNER_PASS),
                first_name="Abdullah",
                last_name="Al-Rashidi",
                status="active",
            )
            db.add(owner)
            await db.flush()

            db.add(UserRole(user_id=owner.id, role_name="agency_owner"))
            db.add(AgencyStaff(
                id=str(uuid.uuid4()),
                agency_id=agency.id,
                user_id=owner.id,
                role="owner",
                status="active",
            ))
            print(f"Created owner: {OWNER_EMAIL} / {OWNER_PASS}")

        # ── Sample packages ──────────────────────────────────────
        for pkg_data in SAMPLE_PACKAGES:
            slug_base = re.sub(r"[^\w-]", "-", pkg_data["title_en"].lower().strip())
            slug = f"{slug_base}-{str(uuid.uuid4())[:8]}"

            pkg = Package(
                id=str(uuid.uuid4()),
                agency_id=agency.id,
                slug=slug,
                title_i18n={"en": pkg_data["title_en"], "ar": pkg_data["title_ar"]},
                summary_i18n={"en": pkg_data["summary_en"], "ar": ""},
                category=pkg_data["category"],
                duration_days=pkg_data["duration_days"],
                base_price=pkg_data["base_price"],
                currency=pkg_data["currency"],
                status="published",
            )
            db.add(pkg)

        await db.commit()
        print(f"Seeded {len(SAMPLE_PACKAGES)} packages for {agency.trade_name}")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
