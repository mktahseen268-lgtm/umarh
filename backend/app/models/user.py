from sqlalchemy import String, Index, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKey, utcnow
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

if TYPE_CHECKING:
    from app.models.agency import AgencyStaff
    from app.models.booking import Booking
    from app.models.review import Review


class User(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "users"

    email:                Mapped[str]            = mapped_column(String(254), unique=True, index=True, nullable=False)
    phone:                Mapped[Optional[str]]  = mapped_column(String(30), unique=True)
    password_hash:        Mapped[str]            = mapped_column(String(256), nullable=False)
    first_name:           Mapped[str]            = mapped_column(String(100), nullable=False)
    last_name:            Mapped[str]            = mapped_column(String(100), nullable=False)
    avatar_url:           Mapped[Optional[str]]  = mapped_column(String(512))
    preferred_language:   Mapped[str]            = mapped_column(String(10), default="en")
    preferred_currency:   Mapped[str]            = mapped_column(String(10), default="USD")
    country_code:         Mapped[Optional[str]]  = mapped_column(String(10))
    email_verified_at:    Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    phone_verified_at:    Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    mfa_secret:           Mapped[Optional[str]]  = mapped_column(String(64))
    status:               Mapped[str]            = mapped_column(String(20), default="pending_verification", index=True)
    last_login_at:        Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    roles:        Mapped[List["UserRole"]]        = relationship("UserRole", back_populates="user", lazy="selectin")
    bookings:     Mapped[List["Booking"]]         = relationship("Booking",  back_populates="customer")
    reviews:      Mapped[List["Review"]]          = relationship("Review",   back_populates="customer")
    agency_staff: Mapped[Optional["AgencyStaff"]] = relationship("AgencyStaff", back_populates="user", uselist=False)

    __table_args__ = (
        Index("ix_users_email_status", "email", "status"),
    )

    def __repr__(self) -> str:
        return f"<User {self.email}>"


class UserRole(Base, UUIDPrimaryKey):
    __tablename__ = "user_roles"

    user_id:   Mapped[str]           = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    role_name: Mapped[str]           = mapped_column(String(50), nullable=False)
    scope:     Mapped[str]           = mapped_column(String(20), default="platform")
    scope_id:  Mapped[Optional[str]] = mapped_column(String(36))

    user: Mapped["User"] = relationship("User", back_populates="roles")

    __table_args__ = (
        Index("ix_user_roles_user_role", "user_id", "role_name"),
    )
