from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload
from app.core.deps import DbSession, CurrentUser, AgencyOwnerUser
from app.models.catalog import Package, PackageMedia
from app.models.agency import Agency
import uuid, re

router = APIRouter(prefix="/packages", tags=["packages"])


class PackageListItem(BaseModel):
    id: str; slug: str; title: dict; summary: dict | None
    description: dict | None = None
    category: str; duration_days: int; duration_nights: int = 0
    base_price: float; discounted_price: float | None = None; currency: str
    images: list = []
    rating: float; review_count: int
    destination: dict | None
    agency: dict; status: str
    includes_visa: bool = False
    includes_flights: bool = False
    meal_plan: str | None = None
    language_spoken: list = []
    departure_city: str | None = None
    min_group_size: int = 1
    max_group_size: int | None = None
    guide: dict | None = None

    model_config = {"from_attributes": True}


class PaginatedPackages(BaseModel):
    items: list[PackageListItem]
    total: int; page: int; per_page: int; pages: int


@router.get("", response_model=PaginatedPackages)
async def list_packages(
    db:       DbSession,
    page:     int   = Query(1,   ge=1),
    per_page: int   = Query(12,  ge=1, le=50),
    q:        str | None = None,
    category: str | None = None,
    price_min: float | None = None,
    price_max: float | None = None,
    agency_id: str | None = None,
    sort:     str = "featured",
    status:   str = "published",
) -> PaginatedPackages:
    stmt = (
        select(Package)
        .options(selectinload(Package.media), selectinload(Package.agency), selectinload(Package.destination))
        .where(Package.status == status)
    )

    if q:
        stmt = stmt.where(
            or_(
                Package.title_i18n["en"].astext.ilike(f"%{q}%"),
                Package.title_i18n["ar"].astext.ilike(f"%{q}%"),
            )
        )
    if category:
        stmt = stmt.where(Package.category == category)
    if price_min is not None:
        stmt = stmt.where(Package.base_price >= price_min)
    if price_max is not None:
        stmt = stmt.where(Package.base_price <= price_max)
    if agency_id:
        stmt = stmt.where(Package.agency_id == agency_id)

    sort_map = {
        "price_asc":  Package.base_price.asc(),
        "price_desc": Package.base_price.desc(),
        "rating":     Package.rating.desc(),
        "featured":   Package.published_at.desc(),
    }
    stmt = stmt.order_by(sort_map.get(sort, Package.published_at.desc()))

    total_result = await db.execute(select(func.count()).select_from(stmt.subquery()))
    total = total_result.scalar_one()

    stmt = stmt.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(stmt)
    packages = result.scalars().all()

    items = [_serialize(p) for p in packages]
    return PaginatedPackages(
        items=items, total=total, page=page, per_page=per_page,
        pages=max(1, -(-total // per_page)),
    )


@router.get("/featured", response_model=list[PackageListItem])
async def featured_packages(db: DbSession) -> list[PackageListItem]:
    stmt = (
        select(Package)
        .options(selectinload(Package.media), selectinload(Package.agency), selectinload(Package.destination))
        .where(Package.status == "published")
        .order_by(Package.rating.desc())
        .limit(6)
    )
    result = await db.execute(stmt)
    return [_serialize(p) for p in result.scalars().all()]


@router.get("/{slug}", response_model=PackageListItem)
async def get_package(slug: str, db: DbSession) -> PackageListItem:
    stmt = (
        select(Package)
        .options(selectinload(Package.media), selectinload(Package.agency), selectinload(Package.destination),
                 selectinload(Package.itinerary), selectinload(Package.hotels), selectinload(Package.pricing_rules))
        .where(Package.slug == slug, Package.status == "published")
    )
    result = await db.execute(stmt)
    pkg    = result.scalar_one_or_none()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")
    return _serialize(pkg)


class CreatePackageIn(BaseModel):
    title:        dict
    summary:      dict | None = None
    description:  dict | None = None
    category:     str
    duration_days: int
    duration_nights: int = 0
    base_price:   float
    currency:     str = "USD"


@router.post("", status_code=201, response_model=PackageListItem)
async def create_package(body: CreatePackageIn, db: DbSession, current_user: AgencyOwnerUser) -> PackageListItem:
    # Resolve agency for this owner
    from app.models.agency import AgencyStaff
    staff_result = await db.execute(select(AgencyStaff).where(AgencyStaff.user_id == current_user.id))
    staff = staff_result.scalar_one_or_none()
    if not staff:
        raise HTTPException(status_code=403, detail="No agency found for this user")

    slug_base = re.sub(r"[^\w-]", "-", body.title.get("en", "package").lower())
    slug      = f"{slug_base}-{str(uuid.uuid4())[:8]}"

    pkg = Package(
        id=str(uuid.uuid4()),
        agency_id=staff.agency_id,
        slug=slug,
        title_i18n=body.title,
        summary_i18n=body.summary,
        description_i18n=body.description,
        category=body.category,
        duration_days=body.duration_days,
        duration_nights=body.duration_nights,
        base_price=body.base_price,
        currency=body.currency,
        status="draft",
    )
    db.add(pkg)
    await db.flush()
    return _serialize(pkg)


@router.post("/{pkg_id}/submit")
async def submit_for_approval(pkg_id: str, db: DbSession, current_user: AgencyOwnerUser) -> dict:
    result = await db.execute(select(Package).where(Package.id == pkg_id))
    pkg    = result.scalar_one_or_none()
    if not pkg:
        raise HTTPException(status_code=404, detail="Not found")
    pkg.status = "pending_approval"
    # TODO: notify admin via Celery
    return {"message": "Submitted for review"}


def _serialize(p: Package) -> PackageListItem:
    images = [{"url": m.url, "type": m.type} for m in (p.media or [])]
    return PackageListItem(
        id=p.id, slug=p.slug,
        title=p.title_i18n or {},
        summary=p.summary_i18n,
        description=p.description_i18n,
        category=p.category,
        duration_days=p.duration_days,
        duration_nights=p.duration_nights or 0,
        base_price=p.base_price,
        discounted_price=p.discounted_price,
        currency=p.currency,
        images=images,
        rating=p.rating,
        review_count=p.review_count,
        destination={"name": p.destination.name_i18n, "city": p.destination.city} if p.destination else None,
        agency={"id": p.agency_id, "slug": p.agency.slug if p.agency else "", "trade_name": p.agency.trade_name if p.agency else "", "logo_url": p.agency.logo_url if p.agency else None},
        status=p.status,
        includes_visa=p.includes_visa,
        includes_flights=p.includes_flights,
        meal_plan=p.meal_plan,
        language_spoken=p.language_spoken or [],
        departure_city=p.departure_city,
        min_group_size=p.min_group_size,
        max_group_size=p.max_group_size,
        guide=p.guide_info,
    )
