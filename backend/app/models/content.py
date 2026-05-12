from sqlalchemy import String, Integer, Float, ForeignKey, JSON, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKey
from datetime import datetime


class FAQ(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "faqs"

    category:     Mapped[str]        = mapped_column(String(50), index=True, nullable=False)
    question_i18n: Mapped[dict]      = mapped_column(JSON, nullable=False)
    answer_i18n:   Mapped[dict]      = mapped_column(JSON, nullable=False)
    sort_order:    Mapped[int]       = mapped_column(Integer, default=0)
    status:        Mapped[str]       = mapped_column(String(20), default="published", index=True)


class Testimonial(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "testimonials"

    author_name:  Mapped[str]        = mapped_column(String(100), nullable=False)
    author_role:  Mapped[str | None] = mapped_column(String(100))
    avatar_url:   Mapped[str | None] = mapped_column(String(512))
    content_i18n: Mapped[dict]       = mapped_column(JSON, nullable=False)
    rating:       Mapped[float]      = mapped_column(Float, nullable=False, default=5.0)
    status:       Mapped[str]        = mapped_column(String(20), default="published", index=True)


class BlogPost(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "blog_posts"

    slug:         Mapped[str]           = mapped_column(String(160), unique=True, index=True)
    title_i18n:   Mapped[dict]          = mapped_column(JSON, nullable=False)
    excerpt_i18n: Mapped[dict | None]   = mapped_column(JSON)
    body_i18n:    Mapped[dict | None]   = mapped_column(JSON)
    cover_image:  Mapped[str | None]    = mapped_column(String(512))
    author_id:    Mapped[str | None]    = mapped_column(ForeignKey("users.id"))
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    status:       Mapped[str]           = mapped_column(String(20), default="draft", index=True)
    tags:         Mapped[list | None]   = mapped_column(JSON)
