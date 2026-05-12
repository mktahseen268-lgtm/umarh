from __future__ import annotations
from sqlalchemy import String, Float, Integer, ForeignKey, Index, JSON, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKey, utcnow
from datetime import datetime, date
from typing import TYPE_CHECKING, List, Optional

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.agency import Agency
    from app.models.catalog import Package
    from app.models.review import Review
    from app.models.financial import Commission


class Booking(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "bookings"

    booking_ref:      Mapped[str]            = mapped_column(String(20),  unique=True, index=True, nullable=False)
    customer_id:      Mapped[str]            = mapped_column(ForeignKey("users.id"),    index=True, nullable=False)
    agency_id:        Mapped[str]            = mapped_column(ForeignKey("agencies.id"), index=True, nullable=False)
    package_id:       Mapped[str]            = mapped_column(ForeignKey("packages.id"), index=True, nullable=False)
    package_version:  Mapped[int]            = mapped_column(Integer, default=1)
    status:           Mapped[str]            = mapped_column(String(30), default="pending_payment", index=True)
    total_amount:     Mapped[float]          = mapped_column(Float, nullable=False)
    service_fee:      Mapped[float]          = mapped_column(Float, default=0.0)
    tax_amount:       Mapped[float]          = mapped_column(Float, default=0.0)
    currency:         Mapped[str]            = mapped_column(String(10), default="USD")
    num_adults:       Mapped[int]            = mapped_column(Integer, default=1)
    num_youth:        Mapped[int]            = mapped_column(Integer, default=0)
    num_children:     Mapped[int]            = mapped_column(Integer, default=0)
    start_date:       Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    end_date:         Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    special_requests: Mapped[Optional[str]]  = mapped_column(Text)
    confirmed_at:     Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    cancelled_at:     Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    customer:   Mapped["User"]                  = relationship("User",    back_populates="bookings")
    agency:     Mapped["Agency"]                = relationship("Agency",  back_populates="bookings")
    package:    Mapped["Package"]               = relationship("Package", back_populates="bookings")
    travelers:  Mapped[List["BookingTraveler"]] = relationship("BookingTraveler",  back_populates="booking", cascade="all, delete-orphan")
    payments:   Mapped[List["BookingPayment"]]  = relationship("BookingPayment",   back_populates="booking", cascade="all, delete-orphan")
    documents:  Mapped[List["BookingDocument"]] = relationship("BookingDocument",  back_populates="booking", cascade="all, delete-orphan")
    review:     Mapped[Optional["Review"]]      = relationship("Review",           back_populates="booking", uselist=False)
    commission: Mapped[Optional["Commission"]]  = relationship("Commission",       back_populates="booking", uselist=False)

    __table_args__ = (
        Index("ix_bookings_customer_status", "customer_id", "status"),
        Index("ix_bookings_agency_status",   "agency_id",   "status"),
    )


class BookingTraveler(Base, UUIDPrimaryKey):
    __tablename__ = "booking_travelers"

    booking_id:                Mapped[str]            = mapped_column(ForeignKey("bookings.id", ondelete="CASCADE"), index=True)
    first_name:                Mapped[Optional[str]]  = mapped_column(String(100))
    last_name:                 Mapped[Optional[str]]  = mapped_column(String(100))
    dob:                       Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    gender:                    Mapped[Optional[str]]  = mapped_column(String(10))
    passport_number_encrypted: Mapped[Optional[str]]  = mapped_column(String(512))
    passport_expiry:           Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    nationality:               Mapped[Optional[str]]  = mapped_column(String(10))
    mahram_relation:           Mapped[Optional[str]]  = mapped_column(String(50))

    booking: Mapped["Booking"] = relationship("Booking", back_populates="travelers")


class BookingPayment(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "booking_payments"

    booking_id:    Mapped[str]           = mapped_column(ForeignKey("bookings.id", ondelete="CASCADE"), index=True)
    gateway:       Mapped[Optional[str]] = mapped_column(String(50))
    gateway_ref:   Mapped[Optional[str]] = mapped_column(String(200), index=True)
    amount:        Mapped[float]         = mapped_column(Float, nullable=False)
    currency:      Mapped[str]           = mapped_column(String(10), default="USD")
    status:        Mapped[str]           = mapped_column(String(30), default="pending", index=True)
    paid_at:       Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    refunded_at:   Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    refund_amount: Mapped[Optional[float]]    = mapped_column(Float)

    booking: Mapped["Booking"] = relationship("Booking", back_populates="payments")


class BookingDocument(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "booking_documents"

    booking_id:   Mapped[str]           = mapped_column(ForeignKey("bookings.id", ondelete="CASCADE"), index=True)
    type:         Mapped[Optional[str]] = mapped_column(String(50))
    url:          Mapped[Optional[str]] = mapped_column(String(512))
    uploaded_by:  Mapped[Optional[str]] = mapped_column(String(36))
    uploaded_at:  Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), default=utcnow)

    booking: Mapped["Booking"] = relationship("Booking", back_populates="documents")
