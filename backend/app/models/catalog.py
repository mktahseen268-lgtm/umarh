from __future__ import annotations
from sqlalchemy import String, Float, Integer, Boolean, ForeignKey, Index, JSON, DateTime, Text, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, UUIDPrimaryKey
from datetime import datetime, date
from typing import TYPE_CHECKING, List, Optional

if TYPE_CHECKING:
    from app.models.agency import Agency
    from app.models.booking import Booking
    from app.models.review import Review


class Destination(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "destinations"

    slug:             Mapped[str]           = mapped_column(String(120), unique=True, index=True, nullable=False)
    name_i18n:        Mapped[dict]          = mapped_column(JSON, nullable=False)
    country:          Mapped[str]           = mapped_column(String(10), default="SA")
    city:             Mapped[str]           = mapped_column(String(100), nullable=False)
    lat:              Mapped[Optional[float]] = mapped_column(Float)
    lng:              Mapped[Optional[float]] = mapped_column(Float)
    description_i18n: Mapped[Optional[dict]] = mapped_column(JSON)
    cover_image_url:  Mapped[Optional[str]]  = mapped_column(String(512))
    featured:         Mapped[bool]           = mapped_column(Boolean, default=False, index=True)
    sort_order:       Mapped[int]            = mapped_column(Integer, default=0)

    attractions: Mapped[List["Attraction"]] = relationship("Attraction", back_populates="destination")
    packages:    Mapped[List["Package"]]    = relationship("Package",    back_populates="destination")


class Attraction(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "attractions"

    destination_id:             Mapped[str]           = mapped_column(ForeignKey("destinations.id"), index=True, nullable=False)
    slug:                       Mapped[str]           = mapped_column(String(120), unique=True, index=True)
    name_i18n:                  Mapped[dict]          = mapped_column(JSON, nullable=False)
    description_i18n:           Mapped[Optional[dict]] = mapped_column(JSON)
    lat:                        Mapped[Optional[float]] = mapped_column(Float)
    lng:                        Mapped[Optional[float]] = mapped_column(Float)
    images:                     Mapped[Optional[list]] = mapped_column(JSON)
    religious_significance:     Mapped[Optional[str]]  = mapped_column(Text)
    typical_visit_duration_min: Mapped[Optional[int]]  = mapped_column(Integer)

    destination: Mapped["Destination"] = relationship("Destination", back_populates="attractions")


class Hotel(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "hotels"

    name:                   Mapped[str]           = mapped_column(String(200), nullable=False)
    stars:                  Mapped[Optional[int]] = mapped_column(Integer)
    address:                Mapped[Optional[str]] = mapped_column(Text)
    lat:                    Mapped[Optional[float]] = mapped_column(Float)
    lng:                    Mapped[Optional[float]] = mapped_column(Float)
    distance_to_haram_m:    Mapped[Optional[int]] = mapped_column(Integer, index=True)
    distance_to_nabawi_m:   Mapped[Optional[int]] = mapped_column(Integer, index=True)
    haram_view_available:   Mapped[bool]          = mapped_column(Boolean, default=False)
    amenities:              Mapped[Optional[list]] = mapped_column(JSON)
    images:                 Mapped[Optional[list]] = mapped_column(JSON)

    package_hotels: Mapped[List["PackageHotel"]] = relationship("PackageHotel", back_populates="hotel")

    __table_args__ = (
        Index("ix_hotels_distance_haram", "distance_to_haram_m"),
    )


class Package(Base, UUIDPrimaryKey, TimestampMixin):
    __tablename__ = "packages"

    agency_id:         Mapped[str]           = mapped_column(ForeignKey("agencies.id"),     nullable=False, index=True)
    destination_id:    Mapped[Optional[str]] = mapped_column(ForeignKey("destinations.id"), index=True)
    slug:              Mapped[str]           = mapped_column(String(160), unique=True, index=True, nullable=False)
    title_i18n:        Mapped[dict]          = mapped_column(JSON, nullable=False)
    summary_i18n:      Mapped[Optional[dict]] = mapped_column(JSON)
    description_i18n:  Mapped[Optional[dict]] = mapped_column(JSON)
    category:          Mapped[str]           = mapped_column(String(50), index=True, nullable=False)
    duration_days:     Mapped[int]           = mapped_column(Integer, nullable=False)
    duration_nights:   Mapped[int]           = mapped_column(Integer, default=0)
    base_price:        Mapped[float]         = mapped_column(Float, nullable=False)
    discounted_price:  Mapped[Optional[float]] = mapped_column(Float)
    currency:          Mapped[str]           = mapped_column(String(10), default="USD")
    min_group_size:    Mapped[int]           = mapped_column(Integer, default=1)
    max_group_size:    Mapped[Optional[int]] = mapped_column(Integer)
    departure_city:    Mapped[Optional[str]] = mapped_column(String(100))
    includes_visa:     Mapped[bool]          = mapped_column(Boolean, default=False)
    includes_flights:  Mapped[bool]          = mapped_column(Boolean, default=False)
    meal_plan:         Mapped[Optional[str]] = mapped_column(String(30))
    language_spoken:   Mapped[Optional[list]] = mapped_column(JSON)
    ihram_provided:    Mapped[bool]          = mapped_column(Boolean, default=False)
    dam_handling:      Mapped[bool]          = mapped_column(Boolean, default=False)
    hajj_quota:        Mapped[Optional[int]] = mapped_column(Integer)
    hajj_quota_used:   Mapped[int]           = mapped_column(Integer, default=0)
    guide_info:        Mapped[Optional[dict]] = mapped_column(JSON)
    status:            Mapped[str]           = mapped_column(String(30), default="draft", index=True)
    published_at:      Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    version:           Mapped[int]           = mapped_column(Integer, default=1)
    rating:            Mapped[float]         = mapped_column(Float, default=0.0)
    review_count:      Mapped[int]           = mapped_column(Integer, default=0)

    # ── Extended fields ────────────────────────────────────────────────────────
    package_type:          Mapped[str]           = mapped_column(String(20),  default="economy")
    seasonal_tag:          Mapped[Optional[str]] = mapped_column(String(30))
    start_date:            Mapped[Optional[date]] = mapped_column(Date)
    end_date:              Mapped[Optional[date]] = mapped_column(Date)
    flexible_dates:        Mapped[bool]          = mapped_column(Boolean, default=False)
    price_per_adult:       Mapped[Optional[float]] = mapped_column(Float)
    price_per_child:       Mapped[Optional[float]] = mapped_column(Float)
    price_per_infant:      Mapped[Optional[float]] = mapped_column(Float)
    discount_type:         Mapped[Optional[str]] = mapped_column(String(20))
    discount_value:        Mapped[Optional[float]] = mapped_column(Float)
    installment_option:    Mapped[bool]          = mapped_column(Boolean, default=False)
    airline_name:          Mapped[Optional[str]] = mapped_column(String(100))
    flight_type:           Mapped[Optional[str]] = mapped_column(String(20))
    flight_class:          Mapped[Optional[str]] = mapped_column(String(20))
    airport_transfers:     Mapped[bool]          = mapped_column(Boolean, default=False)
    intercity_transport:   Mapped[Optional[str]] = mapped_column(String(30))
    services_included:     Mapped[Optional[list]] = mapped_column(JSON)
    services_excluded:     Mapped[Optional[list]] = mapped_column(JSON)
    makkah_nights:         Mapped[Optional[int]] = mapped_column(Integer)
    madinah_nights:        Mapped[Optional[int]] = mapped_column(Integer)
    map_lat:               Mapped[Optional[float]] = mapped_column(Float)
    map_lng:               Mapped[Optional[float]] = mapped_column(Float)
    max_persons:           Mapped[Optional[int]] = mapped_column(Integer)
    available_slots:       Mapped[Optional[int]] = mapped_column(Integer)
    booking_deadline:      Mapped[Optional[date]] = mapped_column(Date)
    meta_title:            Mapped[Optional[str]] = mapped_column(String(200))
    meta_description:      Mapped[Optional[str]] = mapped_column(Text)
    meta_keywords:         Mapped[Optional[list]] = mapped_column(JSON)
    og_image_url:          Mapped[Optional[str]] = mapped_column(String(512))
    video_url:             Mapped[Optional[str]] = mapped_column(String(512))
    ziyarat_included:      Mapped[bool]          = mapped_column(Boolean, default=False)
    laundry_service:       Mapped[bool]          = mapped_column(Boolean, default=False)
    wheelchair_assistance: Mapped[bool]          = mapped_column(Boolean, default=False)
    guide_languages:       Mapped[Optional[list]] = mapped_column(JSON)

    agency:        Mapped["Agency"]                    = relationship("Agency",      back_populates="packages")
    destination:   Mapped[Optional["Destination"]]     = relationship("Destination", back_populates="packages")
    itinerary:     Mapped[List["PackageItineraryDay"]]  = relationship("PackageItineraryDay", back_populates="package", order_by="PackageItineraryDay.day_number")
    hotels:        Mapped[List["PackageHotel"]]         = relationship("PackageHotel",        back_populates="package")
    pricing_rules: Mapped[List["PackagePricingRule"]]   = relationship("PackagePricingRule",   back_populates="package")
    media:         Mapped[List["PackageMedia"]]         = relationship("PackageMedia",         back_populates="package", order_by="PackageMedia.sort_order")
    bookings:      Mapped[List["Booking"]]              = relationship("Booking",              back_populates="package")
    reviews:       Mapped[List["Review"]]               = relationship("Review",               back_populates="package")

    __table_args__ = (
        Index("ix_packages_status_published", "status", "published_at"),
        Index("ix_packages_agency_status",    "agency_id", "status"),
        Index("ix_packages_category",         "category"),
    )


class PackageItineraryDay(Base, UUIDPrimaryKey):
    __tablename__ = "package_itinerary_days"

    package_id:       Mapped[str]           = mapped_column(ForeignKey("packages.id", ondelete="CASCADE"), index=True)
    day_number:       Mapped[int]           = mapped_column(Integer, nullable=False)
    title_i18n:       Mapped[dict]          = mapped_column(JSON, nullable=False)
    description_i18n: Mapped[Optional[dict]] = mapped_column(JSON)
    attractions:      Mapped[Optional[list]] = mapped_column(JSON)
    activities:       Mapped[Optional[list]] = mapped_column(JSON)
    location:         Mapped[Optional[str]] = mapped_column(String(100))

    package: Mapped["Package"] = relationship("Package", back_populates="itinerary")


class PackageHotel(Base, UUIDPrimaryKey):
    __tablename__ = "package_hotels"

    package_id:            Mapped[str]           = mapped_column(ForeignKey("packages.id", ondelete="CASCADE"), index=True)
    hotel_id:              Mapped[Optional[str]] = mapped_column(ForeignKey("hotels.id"), index=True, nullable=True)
    city:                  Mapped[Optional[str]] = mapped_column(String(100))
    check_in_day:          Mapped[Optional[int]] = mapped_column(Integer)
    nights:                Mapped[Optional[int]] = mapped_column(Integer)
    room_type:             Mapped[Optional[str]] = mapped_column(String(50))
    board_basis:           Mapped[Optional[str]] = mapped_column(String(30))
    # Inline fields (no hotel FK required)
    hotel_name:            Mapped[Optional[str]] = mapped_column(String(200))
    hotel_name_ar:         Mapped[Optional[str]] = mapped_column(String(200))
    star_rating:           Mapped[Optional[int]] = mapped_column(Integer)
    distance_from_haram_m: Mapped[Optional[int]] = mapped_column(Integer)
    hotel_images:          Mapped[Optional[list]] = mapped_column(JSON)

    package: Mapped["Package"]       = relationship("Package", back_populates="hotels")
    hotel:   Mapped[Optional["Hotel"]] = relationship("Hotel", back_populates="package_hotels")


class PackagePricingRule(Base, UUIDPrimaryKey):
    __tablename__ = "package_pricing_rules"

    package_id:      Mapped[str]           = mapped_column(ForeignKey("packages.id", ondelete="CASCADE"), index=True)
    rule_type:       Mapped[str]           = mapped_column(String(30), nullable=False)
    hijri_start:     Mapped[Optional[str]] = mapped_column(String(20))
    hijri_end:       Mapped[Optional[str]] = mapped_column(String(20))
    multiplier_pct:  Mapped[float]         = mapped_column(Float, default=0.0)
    applies_to:      Mapped[Optional[str]] = mapped_column(String(30))

    package: Mapped["Package"] = relationship("Package", back_populates="pricing_rules")


class PackageMedia(Base, UUIDPrimaryKey):
    __tablename__ = "package_media"

    package_id:  Mapped[str] = mapped_column(ForeignKey("packages.id", ondelete="CASCADE"), index=True)
    type:        Mapped[str] = mapped_column(String(20), nullable=False, default="image")
    url:         Mapped[str] = mapped_column(String(512), nullable=False)
    sort_order:  Mapped[int] = mapped_column(Integer, default=0)

    package: Mapped["Package"] = relationship("Package", back_populates="media")
