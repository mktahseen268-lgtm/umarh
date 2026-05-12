from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from app.core.deps import DbSession, CurrentUser
from app.models.booking import Booking, BookingTraveler
from app.models.catalog import Package
from app.core.security import encrypt_pii
from datetime import date
import uuid, random, string

router = APIRouter(prefix="/bookings", tags=["bookings"])

SERVICE_FEE = 30.0
TAX_PCT     = 0.05


def _generate_ref() -> str:
    return "UMR" + "".join(random.choices(string.digits, k=8))


class TravelerIn(BaseModel):
    first_name:      str
    last_name:       str
    dob:             str | None = None
    gender:          str | None = None
    passport_number: str | None = None
    passport_expiry: str | None = None
    nationality:     str | None = None
    mahram_relation: str | None = None


class CreateBookingIn(BaseModel):
    package_id:      str
    start_date:      str
    end_date:        str
    num_adults:      int = 1
    num_youth:       int = 0
    num_children:    int = 0
    special_requests: str | None = None
    travelers:       list[TravelerIn] = []


class BookingOut(BaseModel):
    id: str; booking_ref: str; status: str
    total_amount: float; service_fee: float
    tax_amount: float; currency: str
    num_adults: int; num_youth: int; num_children: int
    package_id: str; agency_id: str

    model_config = {"from_attributes": True}


@router.post("", status_code=201, response_model=BookingOut)
async def create_booking(body: CreateBookingIn, db: DbSession, current_user: CurrentUser) -> Booking:
    # Load package
    result = await db.execute(select(Package).where(Package.id == body.package_id, Package.status == "published"))
    pkg    = result.scalar_one_or_none()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")

    # Hajj quota check (atomic via advisory lock in production)
    if pkg.hajj_quota is not None:
        remaining = pkg.hajj_quota - pkg.hajj_quota_used
        if remaining < (body.num_adults + body.num_youth + body.num_children):
            raise HTTPException(status_code=409, detail="Insufficient Hajj quota")
        pkg.hajj_quota_used += body.num_adults + body.num_youth + body.num_children

    price_per_head = pkg.discounted_price or pkg.base_price
    total          = price_per_head * (body.num_adults + body.num_youth * 0.7 + body.num_children * 0.5)
    tax            = (total + SERVICE_FEE) * TAX_PCT

    booking = Booking(
        id=str(uuid.uuid4()),
        booking_ref=_generate_ref(),
        customer_id=current_user.id,
        agency_id=pkg.agency_id,
        package_id=pkg.id,
        package_version=pkg.version,
        status="pending_payment",
        total_amount=total,
        service_fee=SERVICE_FEE,
        tax_amount=tax,
        currency=pkg.currency,
        num_adults=body.num_adults,
        num_youth=body.num_youth,
        num_children=body.num_children,
        special_requests=body.special_requests,
    )
    db.add(booking)
    await db.flush()

    for t in body.travelers:
        traveler = BookingTraveler(
            id=str(uuid.uuid4()),
            booking_id=booking.id,
            first_name=t.first_name,
            last_name=t.last_name,
            gender=t.gender,
            nationality=t.nationality,
            mahram_relation=t.mahram_relation,
            passport_number_encrypted=encrypt_pii(t.passport_number) if t.passport_number else None,
        )
        db.add(traveler)

    # TODO: dispatch Celery task to send confirmation email
    return booking


@router.get("", response_model=list[BookingOut])
async def list_my_bookings(
    db: DbSession,
    current_user: CurrentUser,
    status: str | None = None,
    page:   int = Query(1, ge=1),
) -> list[Booking]:
    stmt = select(Booking).where(Booking.customer_id == current_user.id)
    if status:
        stmt = stmt.where(Booking.status == status)
    stmt = stmt.order_by(Booking.created_at.desc()).offset((page - 1) * 10).limit(10)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{booking_id}", response_model=BookingOut)
async def get_booking(booking_id: str, db: DbSession, current_user: CurrentUser) -> Booking:
    result = await db.execute(
        select(Booking)
        .options(selectinload(Booking.travelers), selectinload(Booking.payments))
        .where(Booking.id == booking_id, Booking.customer_id == current_user.id)
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


class CancelIn(BaseModel):
    reason: str


@router.post("/{booking_id}/cancel")
async def cancel_booking(booking_id: str, body: CancelIn, db: DbSession, current_user: CurrentUser) -> dict:
    result = await db.execute(select(Booking).where(Booking.id == booking_id, Booking.customer_id == current_user.id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Not found")
    if booking.status not in ("pending_payment", "confirmed"):
        raise HTTPException(status_code=400, detail=f"Cannot cancel a booking in '{booking.status}' state")
    from datetime import datetime, timezone
    booking.status       = "cancelled"
    booking.cancelled_at = datetime.now(tz=timezone.utc)
    # TODO: trigger refund calculation and Celery task
    return {"message": "Booking cancelled", "booking_ref": booking.booking_ref}
