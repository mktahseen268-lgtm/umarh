from fastapi import APIRouter, HTTPException, Query, Response
from sqlalchemy import select, func
from sqlalchemy.orm import joinedload, selectinload
from app.core.deps import DbSession, SuperAdminUser
from app.core.security import verify_password, create_access_token, create_refresh_token
from app.models.user import User, UserRole
from app.models.agency import Agency
from app.models.booking import Booking
from pydantic import BaseModel, EmailStr
from typing import Optional
import math
from datetime import datetime, timezone

router = APIRouter(prefix="/admin", tags=["admin"])


# ── Admin login (super_admin only) ────────────────────────────────────────────

class AdminLoginIn(BaseModel):
    email: EmailStr
    password: str


class AdminLoginOut(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    status: str
    preferred_language: str
    roles: list[str] = []


@router.post("/login", response_model=AdminLoginOut)
async def admin_login(body: AdminLoginIn, response: Response, db: DbSession) -> AdminLoginOut:
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if user.status == "suspended":
        raise HTTPException(status_code=403, detail="Account suspended")

    roles = [r.role_name for r in user.roles]
    if "super_admin" not in roles:
        raise HTTPException(status_code=403, detail="Admin access required")

    from app.core.config import settings
    secure = settings.is_production
    access  = create_access_token(user.id)
    refresh = create_refresh_token(user.id)
    response.set_cookie("access_token",  access,  httponly=True, samesite="lax", secure=secure, max_age=60 * 30)
    response.set_cookie("refresh_token", refresh, httponly=True, samesite="lax", secure=secure, max_age=60 * 60 * 24 * 30)
    return AdminLoginOut(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        status=user.status,
        preferred_language=user.preferred_language,
        roles=roles,
    )


# ── Stats ─────────────────────────────────────────────────────────────────────

class AdminStats(BaseModel):
    total_users: int
    total_agencies: int
    total_bookings: int
    pending_agencies: int
    confirmed_bookings: int
    revenue_total: float


@router.get("/stats", response_model=AdminStats)
async def get_stats(db: DbSession, _: SuperAdminUser) -> AdminStats:
    total_users     = (await db.execute(select(func.count(User.id)))).scalar_one()
    total_agencies  = (await db.execute(select(func.count(Agency.id)))).scalar_one()
    pending_agencies = (await db.execute(
        select(func.count(Agency.id)).where(Agency.status == "pending")
    )).scalar_one()
    total_bookings  = (await db.execute(select(func.count(Booking.id)))).scalar_one()
    confirmed_bookings = (await db.execute(
        select(func.count(Booking.id)).where(Booking.status == "confirmed")
    )).scalar_one()
    revenue_total   = (await db.execute(select(func.sum(Booking.total_amount)))).scalar_one() or 0.0

    return AdminStats(
        total_users=total_users,
        total_agencies=total_agencies,
        total_bookings=total_bookings,
        pending_agencies=pending_agencies,
        confirmed_bookings=confirmed_bookings,
        revenue_total=revenue_total,
    )


# ── Agencies ──────────────────────────────────────────────────────────────────

class AgencyOut(BaseModel):
    id: str
    slug: str
    trade_name: str
    legal_name: str
    email: str
    country: str
    status: str
    commission_rate: float
    created_at: str


class AgencyListOut(BaseModel):
    items: list[AgencyOut]
    total: int
    page: int
    pages: int


@router.get("/agencies", response_model=AgencyListOut)
async def list_agencies(
    db: DbSession,
    _: SuperAdminUser,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
) -> AgencyListOut:
    query = select(Agency)
    count_q = select(func.count(Agency.id))

    if status:
        query = query.where(Agency.status == status)
        count_q = count_q.where(Agency.status == status)
    if q:
        like = f"%{q}%"
        query = query.where(Agency.trade_name.ilike(like) | Agency.email.ilike(like))
        count_q = count_q.where(Agency.trade_name.ilike(like) | Agency.email.ilike(like))

    total = (await db.execute(count_q)).scalar_one()
    rows = (await db.execute(
        query.order_by(Agency.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    )).scalars().all()

    return AgencyListOut(
        items=[AgencyOut(
            id=a.id, slug=a.slug, trade_name=a.trade_name, legal_name=a.legal_name,
            email=a.email, country=a.country, status=a.status,
            commission_rate=a.commission_rate,
            created_at=a.created_at.isoformat(),
        ) for a in rows],
        total=total,
        page=page,
        pages=max(1, math.ceil(total / per_page)),
    )


class UpdateAgencyStatusIn(BaseModel):
    status: str


@router.patch("/agencies/{agency_id}")
async def update_agency_status(
    agency_id: str,
    body: UpdateAgencyStatusIn,
    db: DbSession,
    current_user: SuperAdminUser,
) -> dict:
    valid = {"approved", "rejected", "suspended", "pending"}
    if body.status not in valid:
        raise HTTPException(status_code=400, detail=f"status must be one of {valid}")

    result = await db.execute(select(Agency).where(Agency.id == agency_id))
    agency = result.scalar_one_or_none()
    if not agency:
        raise HTTPException(status_code=404, detail="Agency not found")

    agency.status = body.status
    if body.status == "approved":
        agency.approved_at = datetime.now(timezone.utc)
        agency.approved_by = current_user.id

    return {"id": agency_id, "status": agency.status}


# ── Bookings ──────────────────────────────────────────────────────────────────

class BookingOut(BaseModel):
    id: str
    booking_ref: str
    status: str
    total_amount: float
    currency: str
    num_adults: int
    start_date: Optional[str]
    customer_name: str
    customer_email: str
    agency_name: str
    created_at: str


class BookingListOut(BaseModel):
    items: list[BookingOut]
    total: int
    page: int
    pages: int


@router.get("/bookings", response_model=BookingListOut)
async def list_bookings(
    db: DbSession,
    _: SuperAdminUser,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
) -> BookingListOut:
    query = select(Booking).options(
        joinedload(Booking.customer),
        joinedload(Booking.agency),
    )
    count_q = select(func.count(Booking.id))

    if status:
        query = query.where(Booking.status == status)
        count_q = count_q.where(Booking.status == status)
    if q:
        like = f"%{q.upper()}%"
        query = query.where(Booking.booking_ref.ilike(like))
        count_q = count_q.where(Booking.booking_ref.ilike(like))

    total = (await db.execute(count_q)).scalar_one()
    rows = (await db.execute(
        query.order_by(Booking.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    )).unique().scalars().all()

    return BookingListOut(
        items=[BookingOut(
            id=b.id,
            booking_ref=b.booking_ref,
            status=b.status,
            total_amount=b.total_amount,
            currency=b.currency,
            num_adults=b.num_adults,
            start_date=b.start_date.isoformat() if b.start_date else None,
            customer_name=f"{b.customer.first_name} {b.customer.last_name}",
            customer_email=b.customer.email,
            agency_name=b.agency.trade_name,
            created_at=b.created_at.isoformat(),
        ) for b in rows],
        total=total,
        page=page,
        pages=max(1, math.ceil(total / per_page)),
    )


# ── Users ─────────────────────────────────────────────────────────────────────

class AdminUserOut(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    status: str
    preferred_language: str
    created_at: str
    roles: list[str]


class UserListOut(BaseModel):
    items: list[AdminUserOut]
    total: int
    page: int
    pages: int


@router.get("/users", response_model=UserListOut)
async def list_users(
    db: DbSession,
    _: SuperAdminUser,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    q: Optional[str] = Query(None),
) -> UserListOut:
    query = select(User).options(selectinload(User.roles))
    count_q = select(func.count(User.id))

    if q:
        like = f"%{q}%"
        query = query.where(User.email.ilike(like) | User.first_name.ilike(like) | User.last_name.ilike(like))
        count_q = count_q.where(User.email.ilike(like) | User.first_name.ilike(like) | User.last_name.ilike(like))

    total = (await db.execute(count_q)).scalar_one()
    rows = (await db.execute(
        query.order_by(User.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    )).unique().scalars().all()

    return UserListOut(
        items=[AdminUserOut(
            id=u.id, email=u.email, first_name=u.first_name, last_name=u.last_name,
            status=u.status, preferred_language=u.preferred_language,
            created_at=u.created_at.isoformat(),
            roles=[r.role_name for r in u.roles],
        ) for u in rows],
        total=total,
        page=page,
        pages=max(1, math.ceil(total / per_page)),
    )



# ── Packages ──────────────────────────────────────────────────────────────────

class AdminPackageOut(BaseModel):
    id: str
    slug: str
    title: dict
    category: str
    duration_days: int
    base_price: float
    currency: str
    status: str
    agency_name: str
    agency_id: str
    created_at: str


class AdminPackageListOut(BaseModel):
    items: list[AdminPackageOut]
    total: int
    page: int
    pages: int


@router.get("/packages", response_model=AdminPackageListOut)
async def list_admin_packages(
    db: DbSession,
    _: SuperAdminUser,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
) -> AdminPackageListOut:
    from app.models.catalog import Package
    from sqlalchemy.orm import joinedload

    query = select(Package).options(joinedload(Package.agency))
    count_q = select(func.count(Package.id))

    if status:
        query = query.where(Package.status == status)
        count_q = count_q.where(Package.status == status)
    if category:
        query = query.where(Package.category == category)
        count_q = count_q.where(Package.category == category)
    if q:
        like = f"%{q}%"
        query = query.where(Package.title_i18n["en"].astext.ilike(like))
        count_q = count_q.where(Package.title_i18n["en"].astext.ilike(like))

    total = (await db.execute(count_q)).scalar_one()
    rows = (await db.execute(
        query.order_by(Package.created_at.desc()).offset((page - 1) * per_page).limit(per_page)
    )).unique().scalars().all()

    return AdminPackageListOut(
        items=[AdminPackageOut(
            id=p.id, slug=p.slug, title=p.title_i18n or {},
            category=p.category, duration_days=p.duration_days,
            base_price=p.base_price, currency=p.currency, status=p.status,
            agency_name=p.agency.trade_name if p.agency else "",
            agency_id=p.agency_id,
            created_at=p.created_at.isoformat(),
        ) for p in rows],
        total=total, page=page,
        pages=max(1, math.ceil(total / per_page)),
    )


# ── Full package schemas ───────────────────────────────────────────────────────

class HotelEntryIn(BaseModel):
    hotel_name:            str
    hotel_name_ar:         str = ""
    city:                  str = "makkah"
    star_rating:           int = 3
    distance_from_haram_m: int | None = None
    room_type:             str = "double"
    board_basis:           str = "breakfast_only"
    check_in_day:          int | None = None
    nights:                int | None = None
    hotel_images:          list[str] = []


class ItineraryDayIn(BaseModel):
    day_number:      int
    title_en:        str
    title_ar:        str = ""
    description_en:  str = ""
    description_ar:  str = ""
    activities:      list[str] = []
    location:        str = ""


class AdminCreatePackageIn(BaseModel):
    # Identity
    agency_id:    str
    title_en:     str
    title_ar:     str = ""
    slug:         str = ""
    # Descriptions
    summary_en:      str = ""
    summary_ar:      str = ""
    description_en:  str = ""
    description_ar:  str = ""
    # Classification
    category:      str
    package_type:  str = "economy"
    status:        str = "draft"
    seasonal_tag:  str = ""
    # Duration & dates
    duration_days:   int
    duration_nights: int = 0
    start_date:      str | None = None
    end_date:        str | None = None
    flexible_dates:  bool = False
    makkah_nights:   int | None = None
    madinah_nights:  int | None = None
    # Pricing
    base_price:       float
    currency:         str = "USD"
    price_per_adult:  float | None = None
    price_per_child:  float | None = None
    price_per_infant: float | None = None
    discount_type:    str | None = None
    discount_value:   float | None = None
    installment_option: bool = False
    # Transport
    airline_name:       str = ""
    flight_type:        str = ""
    flight_class:       str = "economy"
    departure_city:     str = ""
    airport_transfers:  bool = False
    intercity_transport: str = ""
    includes_flights:   bool = False
    # Services
    includes_visa:         bool = False
    meal_plan:             str = ""
    ziyarat_included:      bool = False
    laundry_service:       bool = False
    wheelchair_assistance: bool = False
    ihram_provided:        bool = False
    language_spoken:       list[str] = []
    guide_languages:       list[str] = []
    services_included:     list[str] = []
    services_excluded:     list[str] = []
    # Capacity
    min_group_size:   int = 1
    max_group_size:   int | None = None
    max_persons:      int | None = None
    available_slots:  int | None = None
    booking_deadline: str | None = None
    # SEO
    meta_title:       str = ""
    meta_description: str = ""
    meta_keywords:    list[str] = []
    og_image_url:     str = ""
    # Media
    image_urls: list[str] = []
    video_url:  str = ""
    # Nested
    hotels:    list[HotelEntryIn] = []
    itinerary: list[ItineraryDayIn] = []


def _apply_package_fields(pkg: "Package", body: AdminCreatePackageIn) -> None:
    """Apply all extended fields from the request body onto a Package ORM object."""
    import re as _re
    from datetime import date as _date

    def _d(s: str | None) -> "_date | None":
        try: return _date.fromisoformat(s) if s else None
        except: return None

    pkg.title_i18n       = {"en": body.title_en, "ar": body.title_ar or body.title_en}
    pkg.summary_i18n     = {"en": body.summary_en, "ar": body.summary_ar} if (body.summary_en or body.summary_ar) else None
    pkg.description_i18n = {"en": body.description_en, "ar": body.description_ar} if (body.description_en or body.description_ar) else None
    pkg.category         = body.category
    pkg.package_type     = body.package_type
    pkg.seasonal_tag     = body.seasonal_tag or None
    pkg.duration_days    = body.duration_days
    pkg.duration_nights  = body.duration_nights
    pkg.start_date       = _d(body.start_date)
    pkg.end_date         = _d(body.end_date)
    pkg.flexible_dates   = body.flexible_dates
    pkg.makkah_nights    = body.makkah_nights
    pkg.madinah_nights   = body.madinah_nights
    pkg.base_price       = body.base_price
    pkg.currency         = body.currency
    pkg.price_per_adult  = body.price_per_adult
    pkg.price_per_child  = body.price_per_child
    pkg.price_per_infant = body.price_per_infant
    pkg.discount_type    = body.discount_type or None
    pkg.discount_value   = body.discount_value
    pkg.installment_option = body.installment_option
    if body.discount_type and body.discount_value:
        if body.discount_type == "percent":
            pkg.discounted_price = round(body.base_price * (1 - body.discount_value / 100), 2)
        else:
            pkg.discounted_price = max(0, body.base_price - body.discount_value)
    pkg.airline_name       = body.airline_name or None
    pkg.flight_type        = body.flight_type or None
    pkg.flight_class       = body.flight_class or None
    pkg.departure_city     = body.departure_city or None
    pkg.airport_transfers  = body.airport_transfers
    pkg.intercity_transport = body.intercity_transport or None
    pkg.includes_flights    = body.includes_flights
    pkg.includes_visa       = body.includes_visa
    pkg.meal_plan           = body.meal_plan or None
    pkg.ziyarat_included    = body.ziyarat_included
    pkg.laundry_service     = body.laundry_service
    pkg.wheelchair_assistance = body.wheelchair_assistance
    pkg.ihram_provided      = body.ihram_provided
    pkg.language_spoken     = body.language_spoken or None
    pkg.guide_languages     = body.guide_languages or None
    pkg.services_included   = body.services_included or None
    pkg.services_excluded   = body.services_excluded or None
    pkg.min_group_size      = body.min_group_size
    pkg.max_group_size      = body.max_group_size
    pkg.max_persons         = body.max_persons
    pkg.available_slots     = body.available_slots
    pkg.booking_deadline    = _d(body.booking_deadline)
    pkg.meta_title          = body.meta_title or None
    pkg.meta_description    = body.meta_description or None
    pkg.meta_keywords       = body.meta_keywords or None
    pkg.og_image_url        = body.og_image_url or None
    pkg.video_url           = body.video_url or None


@router.post("/packages", status_code=201)
async def admin_create_package(
    body: AdminCreatePackageIn,
    db: DbSession,
    _: SuperAdminUser,
) -> dict:
    from app.models.catalog import Package, PackageMedia, PackageHotel, PackageItineraryDay
    import re

    agency = (await db.execute(select(Agency).where(Agency.id == body.agency_id))).scalar_one_or_none()
    if not agency:
        raise HTTPException(status_code=404, detail="Agency not found")

    if body.slug:
        slug_base = re.sub(r"[^\w-]", "-", body.slug.lower().strip())
    else:
        slug_base = re.sub(r"[^\w-]", "-", body.title_en.lower().strip())
    slug = f"{slug_base}-{str(uuid.uuid4())[:8]}"

    pkg = Package(id=str(uuid.uuid4()), agency_id=body.agency_id, slug=slug, status=body.status)
    _apply_package_fields(pkg, body)
    db.add(pkg)
    await db.flush()

    for i, url in enumerate(body.image_urls):
        if url.strip():
            db.add(PackageMedia(id=str(uuid.uuid4()), package_id=pkg.id, type="image", url=url.strip(), sort_order=i))
    if body.video_url:
        db.add(PackageMedia(id=str(uuid.uuid4()), package_id=pkg.id, type="video", url=body.video_url.strip(), sort_order=999))

    for h in body.hotels:
        db.add(PackageHotel(
            id=str(uuid.uuid4()), package_id=pkg.id,
            hotel_name=h.hotel_name, hotel_name_ar=h.hotel_name_ar or None,
            city=h.city, star_rating=h.star_rating,
            distance_from_haram_m=h.distance_from_haram_m,
            room_type=h.room_type, board_basis=h.board_basis,
            check_in_day=h.check_in_day, nights=h.nights,
            hotel_images=h.hotel_images or None,
        ))

    for day in body.itinerary:
        db.add(PackageItineraryDay(
            id=str(uuid.uuid4()), package_id=pkg.id,
            day_number=day.day_number,
            title_i18n={"en": day.title_en, "ar": day.title_ar or day.title_en},
            description_i18n={"en": day.description_en, "ar": day.description_ar} if day.description_en else None,
            activities=day.activities or None,
            location=day.location or None,
        ))

    return {"id": pkg.id, "slug": pkg.slug, "status": pkg.status,
            "title": pkg.title_i18n, "category": pkg.category,
            "duration_days": pkg.duration_days, "base_price": pkg.base_price,
            "currency": pkg.currency, "agency_id": pkg.agency_id,
            "agency_name": agency.trade_name, "created_at": pkg.created_at.isoformat()}


@router.get("/packages/{package_id}")
async def admin_get_package(package_id: str, db: DbSession, _: SuperAdminUser) -> dict:
    from app.models.catalog import Package
    stmt = (
        select(Package)
        .options(
            selectinload(Package.media), selectinload(Package.agency),
            selectinload(Package.itinerary), selectinload(Package.hotels),
        )
        .where(Package.id == package_id)
    )
    pkg = (await db.execute(stmt)).scalar_one_or_none()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")

    return {
        "id": pkg.id, "slug": pkg.slug, "status": pkg.status,
        "agency_id": pkg.agency_id,
        "agency_name": pkg.agency.trade_name if pkg.agency else "",
        "title_en": (pkg.title_i18n or {}).get("en", ""),
        "title_ar": (pkg.title_i18n or {}).get("ar", ""),
        "summary_en": (pkg.summary_i18n or {}).get("en", ""),
        "summary_ar": (pkg.summary_i18n or {}).get("ar", ""),
        "description_en": (pkg.description_i18n or {}).get("en", ""),
        "description_ar": (pkg.description_i18n or {}).get("ar", ""),
        "category": pkg.category, "package_type": pkg.package_type,
        "seasonal_tag": pkg.seasonal_tag,
        "duration_days": pkg.duration_days, "duration_nights": pkg.duration_nights,
        "start_date": pkg.start_date.isoformat() if pkg.start_date else None,
        "end_date": pkg.end_date.isoformat() if pkg.end_date else None,
        "flexible_dates": pkg.flexible_dates,
        "makkah_nights": pkg.makkah_nights, "madinah_nights": pkg.madinah_nights,
        "base_price": pkg.base_price, "currency": pkg.currency,
        "price_per_adult": pkg.price_per_adult, "price_per_child": pkg.price_per_child,
        "price_per_infant": pkg.price_per_infant,
        "discount_type": pkg.discount_type, "discount_value": pkg.discount_value,
        "discounted_price": pkg.discounted_price, "installment_option": pkg.installment_option,
        "airline_name": pkg.airline_name, "flight_type": pkg.flight_type,
        "flight_class": pkg.flight_class, "departure_city": pkg.departure_city,
        "airport_transfers": pkg.airport_transfers, "intercity_transport": pkg.intercity_transport,
        "includes_flights": pkg.includes_flights, "includes_visa": pkg.includes_visa,
        "meal_plan": pkg.meal_plan, "ziyarat_included": pkg.ziyarat_included,
        "laundry_service": pkg.laundry_service, "wheelchair_assistance": pkg.wheelchair_assistance,
        "ihram_provided": pkg.ihram_provided,
        "language_spoken": pkg.language_spoken or [], "guide_languages": pkg.guide_languages or [],
        "services_included": pkg.services_included or [], "services_excluded": pkg.services_excluded or [],
        "min_group_size": pkg.min_group_size, "max_group_size": pkg.max_group_size,
        "max_persons": pkg.max_persons, "available_slots": pkg.available_slots,
        "booking_deadline": pkg.booking_deadline.isoformat() if pkg.booking_deadline else None,
        "meta_title": pkg.meta_title, "meta_description": pkg.meta_description,
        "meta_keywords": pkg.meta_keywords or [], "og_image_url": pkg.og_image_url,
        "video_url": pkg.video_url,
        "image_urls": [m.url for m in pkg.media if m.type == "image"],
        "hotels": [
            {
                "id": h.id, "hotel_name": h.hotel_name, "hotel_name_ar": h.hotel_name_ar,
                "city": h.city, "star_rating": h.star_rating,
                "distance_from_haram_m": h.distance_from_haram_m,
                "room_type": h.room_type, "board_basis": h.board_basis,
                "check_in_day": h.check_in_day, "nights": h.nights,
                "hotel_images": h.hotel_images or [],
            } for h in (pkg.hotels or [])
        ],
        "itinerary": [
            {
                "id": d.id, "day_number": d.day_number,
                "title_en": (d.title_i18n or {}).get("en", ""),
                "title_ar": (d.title_i18n or {}).get("ar", ""),
                "description_en": (d.description_i18n or {}).get("en", ""),
                "description_ar": (d.description_i18n or {}).get("ar", ""),
                "activities": d.activities or [], "location": d.location,
            } for d in (pkg.itinerary or [])
        ],
    }


@router.put("/packages/{package_id}")
async def admin_update_package(
    package_id: str,
    body: AdminCreatePackageIn,
    db: DbSession,
    _: SuperAdminUser,
) -> dict:
    from app.models.catalog import Package, PackageMedia, PackageHotel, PackageItineraryDay

    stmt = (
        select(Package)
        .options(selectinload(Package.media), selectinload(Package.hotels), selectinload(Package.itinerary))
        .where(Package.id == package_id)
    )
    pkg = (await db.execute(stmt)).scalar_one_or_none()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")

    _apply_package_fields(pkg, body)
    if body.status:
        pkg.status = body.status
        if body.status == "published" and not pkg.published_at:
            pkg.published_at = datetime.now(timezone.utc)

    # Replace media
    for m in list(pkg.media):
        await db.delete(m)
    for i, url in enumerate(body.image_urls):
        if url.strip():
            db.add(PackageMedia(id=str(uuid.uuid4()), package_id=pkg.id, type="image", url=url.strip(), sort_order=i))
    if body.video_url:
        db.add(PackageMedia(id=str(uuid.uuid4()), package_id=pkg.id, type="video", url=body.video_url.strip(), sort_order=999))

    # Replace hotels
    for h in list(pkg.hotels):
        await db.delete(h)
    for h in body.hotels:
        db.add(PackageHotel(
            id=str(uuid.uuid4()), package_id=pkg.id,
            hotel_name=h.hotel_name, hotel_name_ar=h.hotel_name_ar or None,
            city=h.city, star_rating=h.star_rating,
            distance_from_haram_m=h.distance_from_haram_m,
            room_type=h.room_type, board_basis=h.board_basis,
            check_in_day=h.check_in_day, nights=h.nights,
            hotel_images=h.hotel_images or None,
        ))

    # Replace itinerary
    for d in list(pkg.itinerary):
        await db.delete(d)
    for day in body.itinerary:
        db.add(PackageItineraryDay(
            id=str(uuid.uuid4()), package_id=pkg.id,
            day_number=day.day_number,
            title_i18n={"en": day.title_en, "ar": day.title_ar or day.title_en},
            description_i18n={"en": day.description_en, "ar": day.description_ar} if day.description_en else None,
            activities=day.activities or None,
            location=day.location or None,
        ))

    return {"id": pkg.id, "slug": pkg.slug, "status": pkg.status}


class UpdatePackageStatusIn(BaseModel):
    status: str


@router.patch("/packages/{package_id}")
async def admin_update_package_status(
    package_id: str,
    body: UpdatePackageStatusIn,
    db: DbSession,
    _: SuperAdminUser,
) -> dict:
    from app.models.catalog import Package

    pkg = (await db.execute(select(Package).where(Package.id == package_id))).scalar_one_or_none()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")

    valid = {"draft", "pending_approval", "published", "rejected", "archived"}
    if body.status not in valid:
        raise HTTPException(status_code=400, detail=f"status must be one of {valid}")

    pkg.status = body.status
    if body.status == "published" and not pkg.published_at:
        pkg.published_at = datetime.now(timezone.utc)

    return {"id": package_id, "status": pkg.status}


class UpdateUserStatusIn(BaseModel):
    status: str


@router.patch("/users/{user_id}")
async def update_user_status(
    user_id: str,
    body: UpdateUserStatusIn,
    db: DbSession,
    _: SuperAdminUser,
) -> dict:
    valid = {"active", "suspended", "pending_verification"}
    if body.status not in valid:
        raise HTTPException(status_code=400, detail=f"status must be one of {valid}")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.status = body.status
    return {"id": user_id, "status": user.status}
