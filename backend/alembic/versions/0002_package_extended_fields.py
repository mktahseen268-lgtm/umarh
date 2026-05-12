"""package extended fields

Revision ID: 0002
Revises: 0001
Create Date: 2026-04-23
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── packages: extended fields ──────────────────────────────────────────────
    op.add_column("packages", sa.Column("package_type",          sa.String(20),  nullable=False, server_default="economy"))
    op.add_column("packages", sa.Column("seasonal_tag",          sa.String(30),  nullable=True))
    op.add_column("packages", sa.Column("start_date",            sa.Date(),      nullable=True))
    op.add_column("packages", sa.Column("end_date",              sa.Date(),      nullable=True))
    op.add_column("packages", sa.Column("flexible_dates",        sa.Boolean(),   nullable=False, server_default="false"))
    op.add_column("packages", sa.Column("price_per_adult",       sa.Float(),     nullable=True))
    op.add_column("packages", sa.Column("price_per_child",       sa.Float(),     nullable=True))
    op.add_column("packages", sa.Column("price_per_infant",      sa.Float(),     nullable=True))
    op.add_column("packages", sa.Column("discount_type",         sa.String(20),  nullable=True))
    op.add_column("packages", sa.Column("discount_value",        sa.Float(),     nullable=True))
    op.add_column("packages", sa.Column("installment_option",    sa.Boolean(),   nullable=False, server_default="false"))
    op.add_column("packages", sa.Column("airline_name",          sa.String(100), nullable=True))
    op.add_column("packages", sa.Column("flight_type",           sa.String(20),  nullable=True))
    op.add_column("packages", sa.Column("flight_class",          sa.String(20),  nullable=True))
    op.add_column("packages", sa.Column("airport_transfers",     sa.Boolean(),   nullable=False, server_default="false"))
    op.add_column("packages", sa.Column("intercity_transport",   sa.String(30),  nullable=True))
    op.add_column("packages", sa.Column("services_included",     postgresql.JSON(), nullable=True))
    op.add_column("packages", sa.Column("services_excluded",     postgresql.JSON(), nullable=True))
    op.add_column("packages", sa.Column("makkah_nights",         sa.Integer(),   nullable=True))
    op.add_column("packages", sa.Column("madinah_nights",        sa.Integer(),   nullable=True))
    op.add_column("packages", sa.Column("map_lat",               sa.Float(),     nullable=True))
    op.add_column("packages", sa.Column("map_lng",               sa.Float(),     nullable=True))
    op.add_column("packages", sa.Column("max_persons",           sa.Integer(),   nullable=True))
    op.add_column("packages", sa.Column("available_slots",       sa.Integer(),   nullable=True))
    op.add_column("packages", sa.Column("booking_deadline",      sa.Date(),      nullable=True))
    op.add_column("packages", sa.Column("meta_title",            sa.String(200), nullable=True))
    op.add_column("packages", sa.Column("meta_description",      sa.Text(),      nullable=True))
    op.add_column("packages", sa.Column("meta_keywords",         postgresql.JSON(), nullable=True))
    op.add_column("packages", sa.Column("og_image_url",          sa.String(512), nullable=True))
    op.add_column("packages", sa.Column("video_url",             sa.String(512), nullable=True))
    op.add_column("packages", sa.Column("ziyarat_included",      sa.Boolean(),   nullable=False, server_default="false"))
    op.add_column("packages", sa.Column("laundry_service",       sa.Boolean(),   nullable=False, server_default="false"))
    op.add_column("packages", sa.Column("wheelchair_assistance", sa.Boolean(),   nullable=False, server_default="false"))
    op.add_column("packages", sa.Column("guide_languages",       postgresql.JSON(), nullable=True))

    # ── package_hotels: inline fields + make hotel_id nullable ─────────────────
    op.alter_column("package_hotels", "hotel_id", nullable=True)
    op.add_column("package_hotels", sa.Column("hotel_name",            sa.String(200), nullable=True))
    op.add_column("package_hotels", sa.Column("hotel_name_ar",         sa.String(200), nullable=True))
    op.add_column("package_hotels", sa.Column("star_rating",           sa.Integer(),   nullable=True))
    op.add_column("package_hotels", sa.Column("distance_from_haram_m", sa.Integer(),   nullable=True))
    op.add_column("package_hotels", sa.Column("hotel_images",          postgresql.JSON(), nullable=True))

    # ── package_itinerary_days: extra fields ───────────────────────────────────
    op.add_column("package_itinerary_days", sa.Column("activities", postgresql.JSON(), nullable=True))
    op.add_column("package_itinerary_days", sa.Column("location",   sa.String(100),    nullable=True))


def downgrade() -> None:
    # itinerary
    op.drop_column("package_itinerary_days", "location")
    op.drop_column("package_itinerary_days", "activities")
    # hotels
    op.drop_column("package_hotels", "hotel_images")
    op.drop_column("package_hotels", "distance_from_haram_m")
    op.drop_column("package_hotels", "star_rating")
    op.drop_column("package_hotels", "hotel_name_ar")
    op.drop_column("package_hotels", "hotel_name")
    op.alter_column("package_hotels", "hotel_id", nullable=False)
    # packages
    for col in [
        "guide_languages", "wheelchair_assistance", "laundry_service", "ziyarat_included",
        "video_url", "og_image_url", "meta_keywords", "meta_description", "meta_title",
        "booking_deadline", "available_slots", "max_persons", "map_lng", "map_lat",
        "madinah_nights", "makkah_nights", "services_excluded", "services_included",
        "intercity_transport", "airport_transfers", "flight_class", "flight_type",
        "airline_name", "installment_option", "discount_value", "discount_type",
        "price_per_infant", "price_per_child", "price_per_adult",
        "flexible_dates", "end_date", "start_date", "seasonal_tag", "package_type",
    ]:
        op.drop_column("packages", col)
