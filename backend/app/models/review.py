from __future__ import annotations
from sqlalchemy import String, Float, Integer, ForeignKey, Index, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKey
from typing import TYPE_CHECKING, List, Optional

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.agency import Agency
    from app.models.catalog import Package
    from app.models.booking import Booking


class Review(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "reviews"

    booking_id:  Mapped[str]           = mapped_column(ForeignKey("bookings.id"),  unique=True, index=True, nullable=False)
    customer_id: Mapped[str]           = mapped_column(ForeignKey("users.id"),     index=True,  nullable=False)
    package_id:  Mapped[str]           = mapped_column(ForeignKey("packages.id"),  index=True,  nullable=False)
    agency_id:   Mapped[str]           = mapped_column(ForeignKey("agencies.id"),  index=True,  nullable=False)
    rating:      Mapped[float]         = mapped_column(Float, nullable=False)
    title:       Mapped[Optional[str]] = mapped_column(String(200))
    body:        Mapped[Optional[str]] = mapped_column(Text)
    images:      Mapped[Optional[list]] = mapped_column(JSON)
    status:      Mapped[str]           = mapped_column(String(20), default="pending", index=True)

    booking:  Mapped["Booking"] = relationship("Booking",  back_populates="review")
    customer: Mapped["User"]    = relationship("User",     back_populates="reviews")
    package:  Mapped["Package"] = relationship("Package",  back_populates="reviews")

    __table_args__ = (
        Index("ix_reviews_package_status", "package_id", "status"),
        Index("ix_reviews_agency_status",  "agency_id",  "status"),
    )
