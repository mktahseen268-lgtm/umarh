from __future__ import annotations
from sqlalchemy import String, Float, ForeignKey, Index, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKey
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

if TYPE_CHECKING:
    from app.models.agency import Agency
    from app.models.booking import Booking


class Commission(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "commissions"

    booking_id:        Mapped[str]           = mapped_column(ForeignKey("bookings.id"),  unique=True, index=True)
    agency_id:         Mapped[str]           = mapped_column(ForeignKey("agencies.id"),  index=True)
    gross:             Mapped[float]         = mapped_column(Float, nullable=False)
    commission_pct:    Mapped[float]         = mapped_column(Float, nullable=False)
    commission_amount: Mapped[float]         = mapped_column(Float, nullable=False)
    agency_net:        Mapped[float]         = mapped_column(Float, nullable=False)
    status:            Mapped[str]           = mapped_column(String(30), default="pending", index=True)
    payout_id:         Mapped[Optional[str]] = mapped_column(ForeignKey("payouts.id"))

    booking: Mapped["Booking"]         = relationship("Booking", back_populates="commission")
    agency:  Mapped["Agency"]          = relationship("Agency",  back_populates="commissions")
    payout:  Mapped[Optional["Payout"]] = relationship("Payout", back_populates="commissions")


class Payout(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "payouts"

    agency_id:    Mapped[str]           = mapped_column(ForeignKey("agencies.id"), index=True)
    period_start: Mapped[datetime]      = mapped_column(DateTime(timezone=True))
    period_end:   Mapped[datetime]      = mapped_column(DateTime(timezone=True))
    total_amount: Mapped[float]         = mapped_column(Float, nullable=False)
    currency:     Mapped[str]           = mapped_column(String(10), default="USD")
    status:       Mapped[str]           = mapped_column(String(30), default="pending", index=True)
    bank_ref:     Mapped[Optional[str]] = mapped_column(String(200))
    initiated_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    settled_at:   Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    agency:      Mapped["Agency"]           = relationship("Agency",     back_populates="payouts")
    commissions: Mapped[List["Commission"]] = relationship("Commission", back_populates="payout")
