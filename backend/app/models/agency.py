from sqlalchemy import String, Float, ForeignKey, Index, JSON, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKey
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.catalog import Package
    from app.models.booking import Booking
    from app.models.financial import Commission, Payout


class Agency(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "agencies"

    slug:                    Mapped[str]           = mapped_column(String(120), unique=True, index=True, nullable=False)
    legal_name:              Mapped[str]           = mapped_column(String(200), nullable=False)
    trade_name:              Mapped[str]           = mapped_column(String(200), nullable=False)
    logo_url:                Mapped[Optional[str]] = mapped_column(String(512))
    email:                   Mapped[str]           = mapped_column(String(254), unique=True, nullable=False)
    phone:                   Mapped[Optional[str]] = mapped_column(String(30))
    country:                 Mapped[str]           = mapped_column(String(10), nullable=False, default="SA")
    license_number:          Mapped[Optional[str]] = mapped_column(String(100))
    commercial_registration: Mapped[Optional[str]] = mapped_column(String(100))
    status:                  Mapped[str]           = mapped_column(String(30), default="pending", index=True)
    commission_rate:         Mapped[float]         = mapped_column(Float, default=10.0)
    default_currency:        Mapped[str]           = mapped_column(String(10), default="USD")
    approved_at:             Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    approved_by:             Mapped[Optional[str]] = mapped_column(String(36))
    kyc_documents:           Mapped[Optional[dict]] = mapped_column(JSON)

    staff:       Mapped[List["AgencyStaff"]] = relationship("AgencyStaff", back_populates="agency")
    packages:    Mapped[List["Package"]]     = relationship("Package",     back_populates="agency")
    bookings:    Mapped[List["Booking"]]     = relationship("Booking",     back_populates="agency")
    commissions: Mapped[List["Commission"]]  = relationship("Commission",  back_populates="agency")
    payouts:     Mapped[List["Payout"]]      = relationship("Payout",      back_populates="agency")

    __table_args__ = (
        Index("ix_agencies_status", "status"),
    )


class AgencyStaff(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "agency_staff"

    agency_id:   Mapped[str]            = mapped_column(ForeignKey("agencies.id", ondelete="CASCADE"), index=True)
    user_id:     Mapped[str]            = mapped_column(ForeignKey("users.id",    ondelete="CASCADE"), index=True, unique=True)
    role:        Mapped[str]            = mapped_column(String(50), nullable=False, default="staff")
    permissions: Mapped[Optional[dict]] = mapped_column(JSON)
    status:      Mapped[str]            = mapped_column(String(20), default="active")

    agency: Mapped["Agency"] = relationship("Agency", back_populates="staff")
    user:   Mapped["User"]   = relationship("User",   back_populates="agency_staff")

    __table_args__ = (
        Index("ix_agency_staff_agency_user", "agency_id", "user_id"),
    )
