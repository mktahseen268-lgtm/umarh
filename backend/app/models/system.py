from sqlalchemy import String, Integer, Boolean, Float, ForeignKey, JSON, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
from app.models.base import UUIDPrimaryKey, utcnow
from datetime import datetime


class AuditLog(Base, UUIDPrimaryKey):
    __tablename__ = "audit_logs"

    actor_id:      Mapped[str | None]  = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    action:        Mapped[str]         = mapped_column(String(100), nullable=False, index=True)
    resource_type: Mapped[str]         = mapped_column(String(100), nullable=False, index=True)
    resource_id:   Mapped[str | None]  = mapped_column(String(36))
    before:        Mapped[dict | None] = mapped_column(JSON)
    after:         Mapped[dict | None] = mapped_column(JSON)
    ip:            Mapped[str | None]  = mapped_column(String(45))
    user_agent:    Mapped[str | None]  = mapped_column(Text)
    created_at:    Mapped[datetime]    = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False, index=True)


class Notification(Base, UUIDPrimaryKey):
    __tablename__ = "notifications"

    user_id:    Mapped[str]          = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    type:       Mapped[str]          = mapped_column(String(50), nullable=False)
    channel:    Mapped[str]          = mapped_column(String(20), nullable=False)
    title_i18n: Mapped[dict]         = mapped_column(JSON, nullable=False)
    body_i18n:  Mapped[dict]         = mapped_column(JSON, nullable=False)
    data:       Mapped[dict | None]  = mapped_column(JSON)
    read_at:    Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime]     = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)


class FeatureFlag(Base, UUIDPrimaryKey):
    __tablename__ = "feature_flags"

    key:         Mapped[str]         = mapped_column(String(100), unique=True, index=True, nullable=False)
    enabled:     Mapped[bool]        = mapped_column(Boolean, default=False)
    rollout_pct: Mapped[float]       = mapped_column(Float, default=0.0)
    conditions:  Mapped[dict | None] = mapped_column(JSON)
