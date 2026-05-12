"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-04-22
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── users ──────────────────────────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id",                  sa.String(36),  primary_key=True),
        sa.Column("email",               sa.String(254), nullable=False),
        sa.Column("phone",               sa.String(30)),
        sa.Column("password_hash",       sa.String(256), nullable=False),
        sa.Column("first_name",          sa.String(100), nullable=False),
        sa.Column("last_name",           sa.String(100), nullable=False),
        sa.Column("avatar_url",          sa.String(512)),
        sa.Column("preferred_language",  sa.String(10),  nullable=False, server_default="en"),
        sa.Column("preferred_currency",  sa.String(10),  nullable=False, server_default="USD"),
        sa.Column("country_code",        sa.String(10)),
        sa.Column("email_verified_at",   sa.DateTime(timezone=True)),
        sa.Column("phone_verified_at",   sa.DateTime(timezone=True)),
        sa.Column("mfa_secret",          sa.String(64)),
        sa.Column("status",              sa.String(20),  nullable=False, server_default="pending_verification"),
        sa.Column("last_login_at",       sa.DateTime(timezone=True)),
        sa.Column("created_at",          sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at",          sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_users_email",        "users", ["email"],  unique=True)
    op.create_index("ix_users_status",       "users", ["status"])
    op.create_index("ix_users_email_status", "users", ["email", "status"])

    # ── user_roles ─────────────────────────────────────────────────────────────
    op.create_table(
        "user_roles",
        sa.Column("id",        sa.String(36), primary_key=True),
        sa.Column("user_id",   sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("role_name", sa.String(50), nullable=False),
        sa.Column("scope",     sa.String(20), nullable=False, server_default="platform"),
        sa.Column("scope_id",  sa.String(36)),
    )
    op.create_index("ix_user_roles_user_id",    "user_roles", ["user_id"])
    op.create_index("ix_user_roles_user_role",  "user_roles", ["user_id", "role_name"])

    # ── agencies ───────────────────────────────────────────────────────────────
    op.create_table(
        "agencies",
        sa.Column("id",                      sa.String(36),  primary_key=True),
        sa.Column("slug",                    sa.String(120), nullable=False),
        sa.Column("legal_name",              sa.String(200), nullable=False),
        sa.Column("trade_name",              sa.String(200), nullable=False),
        sa.Column("logo_url",                sa.String(512)),
        sa.Column("email",                   sa.String(254), nullable=False),
        sa.Column("phone",                   sa.String(30)),
        sa.Column("country",                 sa.String(10),  nullable=False, server_default="SA"),
        sa.Column("license_number",          sa.String(100)),
        sa.Column("commercial_registration", sa.String(100)),
        sa.Column("status",                  sa.String(30),  nullable=False, server_default="pending"),
        sa.Column("commission_rate",         sa.Float,       nullable=False, server_default="10.0"),
        sa.Column("default_currency",        sa.String(10),  nullable=False, server_default="USD"),
        sa.Column("approved_at",             sa.DateTime(timezone=True)),
        sa.Column("approved_by",             sa.String(36)),
        sa.Column("kyc_documents",           postgresql.JSON),
        sa.Column("created_at",              sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at",              sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("uq_agencies_slug",  "agencies", ["slug"],  unique=True)
    op.create_index("uq_agencies_email", "agencies", ["email"], unique=True)
    op.create_index("ix_agencies_status","agencies", ["status"])

    # ── agency_staff ───────────────────────────────────────────────────────────
    op.create_table(
        "agency_staff",
        sa.Column("id",          sa.String(36), primary_key=True),
        sa.Column("agency_id",   sa.String(36), sa.ForeignKey("agencies.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id",     sa.String(36), sa.ForeignKey("users.id",    ondelete="CASCADE"), nullable=False),
        sa.Column("role",        sa.String(50), nullable=False, server_default="staff"),
        sa.Column("permissions", postgresql.JSON),
        sa.Column("status",      sa.String(20), nullable=False, server_default="active"),
        sa.Column("created_at",  sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at",  sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("user_id", name="uq_agency_staff_user_id"),
    )
    op.create_index("ix_agency_staff_agency_id",   "agency_staff", ["agency_id"])
    op.create_index("ix_agency_staff_agency_user",  "agency_staff", ["agency_id", "user_id"])

    # ── destinations ───────────────────────────────────────────────────────────
    op.create_table(
        "destinations",
        sa.Column("id",               sa.String(36),  primary_key=True),
        sa.Column("slug",             sa.String(120), nullable=False),
        sa.Column("name_i18n",        postgresql.JSON, nullable=False),
        sa.Column("country",          sa.String(10),  nullable=False, server_default="SA"),
        sa.Column("city",             sa.String(100), nullable=False),
        sa.Column("lat",              sa.Float),
        sa.Column("lng",              sa.Float),
        sa.Column("description_i18n", postgresql.JSON),
        sa.Column("cover_image_url",  sa.String(512)),
        sa.Column("featured",         sa.Boolean, nullable=False, server_default="false"),
        sa.Column("sort_order",       sa.Integer, nullable=False, server_default="0"),
        sa.Column("created_at",       sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at",       sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("uq_destinations_slug",     "destinations", ["slug"],     unique=True)
    op.create_index("ix_destinations_featured", "destinations", ["featured"])

    # ── attractions ────────────────────────────────────────────────────────────
    op.create_table(
        "attractions",
        sa.Column("id",                         sa.String(36),  primary_key=True),
        sa.Column("destination_id",             sa.String(36),  sa.ForeignKey("destinations.id"), nullable=False),
        sa.Column("slug",                       sa.String(120), nullable=False),
        sa.Column("name_i18n",                  postgresql.JSON, nullable=False),
        sa.Column("description_i18n",           postgresql.JSON),
        sa.Column("lat",                        sa.Float),
        sa.Column("lng",                        sa.Float),
        sa.Column("images",                     postgresql.JSON),
        sa.Column("religious_significance",     sa.Text),
        sa.Column("typical_visit_duration_min", sa.Integer),
        sa.Column("created_at",                 sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at",                 sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("uq_attractions_slug",          "attractions", ["slug"],           unique=True)
    op.create_index("ix_attractions_destination_id","attractions", ["destination_id"])

    # ── hotels ─────────────────────────────────────────────────────────────────
    op.create_table(
        "hotels",
        sa.Column("id",                   sa.String(36),  primary_key=True),
        sa.Column("name",                 sa.String(200), nullable=False),
        sa.Column("stars",                sa.Integer),
        sa.Column("address",              sa.Text),
        sa.Column("lat",                  sa.Float),
        sa.Column("lng",                  sa.Float),
        sa.Column("distance_to_haram_m",  sa.Integer),
        sa.Column("distance_to_nabawi_m", sa.Integer),
        sa.Column("haram_view_available", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("amenities",            postgresql.JSON),
        sa.Column("images",               postgresql.JSON),
        sa.Column("created_at",           sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at",           sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_hotels_distance_haram",  "hotels", ["distance_to_haram_m"])
    op.create_index("ix_hotels_distance_nabawi", "hotels", ["distance_to_nabawi_m"])

    # ── packages ───────────────────────────────────────────────────────────────
    op.create_table(
        "packages",
        sa.Column("id",               sa.String(36),  primary_key=True),
        sa.Column("agency_id",        sa.String(36),  sa.ForeignKey("agencies.id"),     nullable=False),
        sa.Column("destination_id",   sa.String(36),  sa.ForeignKey("destinations.id")),
        sa.Column("slug",             sa.String(160), nullable=False),
        sa.Column("title_i18n",       postgresql.JSON, nullable=False),
        sa.Column("summary_i18n",     postgresql.JSON),
        sa.Column("description_i18n", postgresql.JSON),
        sa.Column("category",         sa.String(50),  nullable=False),
        sa.Column("duration_days",    sa.Integer,     nullable=False),
        sa.Column("duration_nights",  sa.Integer,     nullable=False, server_default="0"),
        sa.Column("base_price",       sa.Float,       nullable=False),
        sa.Column("discounted_price", sa.Float),
        sa.Column("currency",         sa.String(10),  nullable=False, server_default="USD"),
        sa.Column("min_group_size",   sa.Integer,     nullable=False, server_default="1"),
        sa.Column("max_group_size",   sa.Integer),
        sa.Column("departure_city",   sa.String(100)),
        sa.Column("includes_visa",    sa.Boolean,     nullable=False, server_default="false"),
        sa.Column("includes_flights", sa.Boolean,     nullable=False, server_default="false"),
        sa.Column("meal_plan",        sa.String(30)),
        sa.Column("language_spoken",  postgresql.JSON),
        sa.Column("ihram_provided",   sa.Boolean,     nullable=False, server_default="false"),
        sa.Column("dam_handling",     sa.Boolean,     nullable=False, server_default="false"),
        sa.Column("hajj_quota",       sa.Integer),
        sa.Column("hajj_quota_used",  sa.Integer,     nullable=False, server_default="0"),
        sa.Column("guide_info",       postgresql.JSON),
        sa.Column("status",           sa.String(30),  nullable=False, server_default="draft"),
        sa.Column("published_at",     sa.DateTime(timezone=True)),
        sa.Column("version",          sa.Integer,     nullable=False, server_default="1"),
        sa.Column("rating",           sa.Float,       nullable=False, server_default="0.0"),
        sa.Column("review_count",     sa.Integer,     nullable=False, server_default="0"),
        sa.Column("created_at",       sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at",       sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("uq_packages_slug",            "packages", ["slug"],                unique=True)
    op.create_index("ix_packages_agency_id",       "packages", ["agency_id"])
    op.create_index("ix_packages_destination_id",  "packages", ["destination_id"])
    op.create_index("ix_packages_status",          "packages", ["status"])
    op.create_index("ix_packages_category",        "packages", ["category"])
    op.create_index("ix_packages_status_published","packages", ["status", "published_at"])
    op.create_index("ix_packages_agency_status",   "packages", ["agency_id", "status"])

    # ── package_itinerary_days ─────────────────────────────────────────────────
    op.create_table(
        "package_itinerary_days",
        sa.Column("id",               sa.String(36), primary_key=True),
        sa.Column("package_id",       sa.String(36), sa.ForeignKey("packages.id", ondelete="CASCADE"), nullable=False),
        sa.Column("day_number",       sa.Integer,    nullable=False),
        sa.Column("title_i18n",       postgresql.JSON, nullable=False),
        sa.Column("description_i18n", postgresql.JSON),
        sa.Column("attractions",      postgresql.JSON),
    )
    op.create_index("ix_package_itinerary_days_package_id", "package_itinerary_days", ["package_id"])

    # ── package_hotels ─────────────────────────────────────────────────────────
    op.create_table(
        "package_hotels",
        sa.Column("id",           sa.String(36), primary_key=True),
        sa.Column("package_id",   sa.String(36), sa.ForeignKey("packages.id", ondelete="CASCADE"), nullable=False),
        sa.Column("hotel_id",     sa.String(36), sa.ForeignKey("hotels.id"),  nullable=False),
        sa.Column("city",         sa.String(100)),
        sa.Column("check_in_day", sa.Integer),
        sa.Column("nights",       sa.Integer),
        sa.Column("room_type",    sa.String(50)),
        sa.Column("board_basis",  sa.String(30)),
    )
    op.create_index("ix_package_hotels_package_id", "package_hotels", ["package_id"])
    op.create_index("ix_package_hotels_hotel_id",   "package_hotels", ["hotel_id"])

    # ── package_pricing_rules ──────────────────────────────────────────────────
    op.create_table(
        "package_pricing_rules",
        sa.Column("id",              sa.String(36), primary_key=True),
        sa.Column("package_id",      sa.String(36), sa.ForeignKey("packages.id", ondelete="CASCADE"), nullable=False),
        sa.Column("rule_type",       sa.String(30), nullable=False),
        sa.Column("hijri_start",     sa.String(20)),
        sa.Column("hijri_end",       sa.String(20)),
        sa.Column("multiplier_pct",  sa.Float,      nullable=False, server_default="0.0"),
        sa.Column("applies_to",      sa.String(30)),
    )
    op.create_index("ix_package_pricing_rules_package_id", "package_pricing_rules", ["package_id"])

    # ── package_media ──────────────────────────────────────────────────────────
    op.create_table(
        "package_media",
        sa.Column("id",         sa.String(36), primary_key=True),
        sa.Column("package_id", sa.String(36), sa.ForeignKey("packages.id", ondelete="CASCADE"), nullable=False),
        sa.Column("type",       sa.String(20), nullable=False, server_default="image"),
        sa.Column("url",        sa.String(512), nullable=False),
        sa.Column("sort_order", sa.Integer,    nullable=False, server_default="0"),
    )
    op.create_index("ix_package_media_package_id", "package_media", ["package_id"])

    # ── bookings ───────────────────────────────────────────────────────────────
    op.create_table(
        "bookings",
        sa.Column("id",               sa.String(36),  primary_key=True),
        sa.Column("booking_ref",      sa.String(20),  nullable=False),
        sa.Column("customer_id",      sa.String(36),  sa.ForeignKey("users.id"),    nullable=False),
        sa.Column("agency_id",        sa.String(36),  sa.ForeignKey("agencies.id"), nullable=False),
        sa.Column("package_id",       sa.String(36),  sa.ForeignKey("packages.id"), nullable=False),
        sa.Column("package_version",  sa.Integer,     nullable=False, server_default="1"),
        sa.Column("status",           sa.String(30),  nullable=False, server_default="pending_payment"),
        sa.Column("total_amount",     sa.Float,       nullable=False),
        sa.Column("service_fee",      sa.Float,       nullable=False, server_default="0.0"),
        sa.Column("tax_amount",       sa.Float,       nullable=False, server_default="0.0"),
        sa.Column("currency",         sa.String(10),  nullable=False, server_default="USD"),
        sa.Column("num_adults",       sa.Integer,     nullable=False, server_default="1"),
        sa.Column("num_youth",        sa.Integer,     nullable=False, server_default="0"),
        sa.Column("num_children",     sa.Integer,     nullable=False, server_default="0"),
        sa.Column("start_date",       sa.DateTime(timezone=True)),
        sa.Column("end_date",         sa.DateTime(timezone=True)),
        sa.Column("special_requests", sa.Text),
        sa.Column("confirmed_at",     sa.DateTime(timezone=True)),
        sa.Column("cancelled_at",     sa.DateTime(timezone=True)),
        sa.Column("created_at",       sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at",       sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("booking_ref", name="uq_bookings_booking_ref"),
    )
    op.create_index("ix_bookings_booking_ref",      "bookings", ["booking_ref"])
    op.create_index("ix_bookings_customer_id",      "bookings", ["customer_id"])
    op.create_index("ix_bookings_agency_id",        "bookings", ["agency_id"])
    op.create_index("ix_bookings_package_id",       "bookings", ["package_id"])
    op.create_index("ix_bookings_status",           "bookings", ["status"])
    op.create_index("ix_bookings_customer_status",  "bookings", ["customer_id", "status"])
    op.create_index("ix_bookings_agency_status",    "bookings", ["agency_id",   "status"])

    # ── booking_travelers ──────────────────────────────────────────────────────
    op.create_table(
        "booking_travelers",
        sa.Column("id",                         sa.String(36), primary_key=True),
        sa.Column("booking_id",                 sa.String(36), sa.ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False),
        sa.Column("first_name",                 sa.String(100)),
        sa.Column("last_name",                  sa.String(100)),
        sa.Column("dob",                        sa.DateTime(timezone=True)),
        sa.Column("gender",                     sa.String(10)),
        sa.Column("passport_number_encrypted",  sa.String(512)),
        sa.Column("passport_expiry",            sa.DateTime(timezone=True)),
        sa.Column("nationality",                sa.String(10)),
        sa.Column("mahram_relation",            sa.String(50)),
    )
    op.create_index("ix_booking_travelers_booking_id", "booking_travelers", ["booking_id"])

    # ── booking_payments ───────────────────────────────────────────────────────
    op.create_table(
        "booking_payments",
        sa.Column("id",            sa.String(36), primary_key=True),
        sa.Column("booking_id",    sa.String(36), sa.ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False),
        sa.Column("gateway",       sa.String(50)),
        sa.Column("gateway_ref",   sa.String(200)),
        sa.Column("amount",        sa.Float,      nullable=False),
        sa.Column("currency",      sa.String(10), nullable=False, server_default="USD"),
        sa.Column("status",        sa.String(30), nullable=False, server_default="pending"),
        sa.Column("paid_at",       sa.DateTime(timezone=True)),
        sa.Column("refunded_at",   sa.DateTime(timezone=True)),
        sa.Column("refund_amount", sa.Float),
        sa.Column("created_at",    sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at",    sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_booking_payments_booking_id",  "booking_payments", ["booking_id"])
    op.create_index("ix_booking_payments_gateway_ref", "booking_payments", ["gateway_ref"])
    op.create_index("ix_booking_payments_status",      "booking_payments", ["status"])

    # ── booking_documents ──────────────────────────────────────────────────────
    op.create_table(
        "booking_documents",
        sa.Column("id",           sa.String(36), primary_key=True),
        sa.Column("booking_id",   sa.String(36), sa.ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False),
        sa.Column("type",         sa.String(50)),
        sa.Column("url",          sa.String(512)),
        sa.Column("uploaded_by",  sa.String(36)),
        sa.Column("uploaded_at",  sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("created_at",   sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at",   sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_booking_documents_booking_id", "booking_documents", ["booking_id"])

    # ── reviews ────────────────────────────────────────────────────────────────
    op.create_table(
        "reviews",
        sa.Column("id",          sa.String(36), primary_key=True),
        sa.Column("booking_id",  sa.String(36), sa.ForeignKey("bookings.id"),  nullable=False),
        sa.Column("customer_id", sa.String(36), sa.ForeignKey("users.id"),     nullable=False),
        sa.Column("package_id",  sa.String(36), sa.ForeignKey("packages.id"),  nullable=False),
        sa.Column("agency_id",   sa.String(36), sa.ForeignKey("agencies.id"),  nullable=False),
        sa.Column("rating",      sa.Float,      nullable=False),
        sa.Column("title",       sa.String(200)),
        sa.Column("body",        sa.Text),
        sa.Column("images",      postgresql.JSON),
        sa.Column("status",      sa.String(20), nullable=False, server_default="pending"),
        sa.Column("created_at",  sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at",  sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("booking_id", name="uq_reviews_booking_id"),
    )
    op.create_index("ix_reviews_booking_id",       "reviews", ["booking_id"])
    op.create_index("ix_reviews_customer_id",      "reviews", ["customer_id"])
    op.create_index("ix_reviews_package_id",       "reviews", ["package_id"])
    op.create_index("ix_reviews_agency_id",        "reviews", ["agency_id"])
    op.create_index("ix_reviews_status",           "reviews", ["status"])
    op.create_index("ix_reviews_package_status",   "reviews", ["package_id", "status"])
    op.create_index("ix_reviews_agency_status",    "reviews", ["agency_id",  "status"])

    # ── commissions ────────────────────────────────────────────────────────────
    op.create_table(
        "commissions",
        sa.Column("id",                sa.String(36), primary_key=True),
        sa.Column("booking_id",        sa.String(36), sa.ForeignKey("bookings.id"),  nullable=False),
        sa.Column("agency_id",         sa.String(36), sa.ForeignKey("agencies.id"),  nullable=False),
        sa.Column("gross",             sa.Float,      nullable=False),
        sa.Column("commission_pct",    sa.Float,      nullable=False),
        sa.Column("commission_amount", sa.Float,      nullable=False),
        sa.Column("agency_net",        sa.Float,      nullable=False),
        sa.Column("status",            sa.String(30), nullable=False, server_default="pending"),
        sa.Column("payout_id",         sa.String(36)),
        sa.Column("created_at",        sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at",        sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("booking_id", name="uq_commissions_booking_id"),
    )
    op.create_index("ix_commissions_booking_id", "commissions", ["booking_id"])
    op.create_index("ix_commissions_agency_id",  "commissions", ["agency_id"])
    op.create_index("ix_commissions_status",     "commissions", ["status"])

    # ── payouts ────────────────────────────────────────────────────────────────
    op.create_table(
        "payouts",
        sa.Column("id",           sa.String(36), primary_key=True),
        sa.Column("agency_id",    sa.String(36), sa.ForeignKey("agencies.id"), nullable=False),
        sa.Column("period_start", sa.DateTime(timezone=True), nullable=False),
        sa.Column("period_end",   sa.DateTime(timezone=True), nullable=False),
        sa.Column("total_amount", sa.Float,      nullable=False),
        sa.Column("currency",     sa.String(10), nullable=False, server_default="USD"),
        sa.Column("status",       sa.String(30), nullable=False, server_default="pending"),
        sa.Column("bank_ref",     sa.String(200)),
        sa.Column("initiated_at", sa.DateTime(timezone=True)),
        sa.Column("settled_at",   sa.DateTime(timezone=True)),
        sa.Column("created_at",   sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at",   sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_payouts_agency_id", "payouts", ["agency_id"])
    op.create_index("ix_payouts_status",    "payouts", ["status"])

    # Add FK from commissions → payouts now that payouts exists
    op.create_foreign_key("fk_commissions_payout_id", "commissions", "payouts", ["payout_id"], ["id"])

    # ── faqs ───────────────────────────────────────────────────────────────────
    op.create_table(
        "faqs",
        sa.Column("id",            sa.String(36), primary_key=True),
        sa.Column("category",      sa.String(50), nullable=False),
        sa.Column("question_i18n", postgresql.JSON, nullable=False),
        sa.Column("answer_i18n",   postgresql.JSON, nullable=False),
        sa.Column("sort_order",    sa.Integer,    nullable=False, server_default="0"),
        sa.Column("status",        sa.String(20), nullable=False, server_default="published"),
        sa.Column("created_at",    sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at",    sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_faqs_category", "faqs", ["category"])
    op.create_index("ix_faqs_status",   "faqs", ["status"])

    # ── testimonials ───────────────────────────────────────────────────────────
    op.create_table(
        "testimonials",
        sa.Column("id",           sa.String(36), primary_key=True),
        sa.Column("author_name",  sa.String(100), nullable=False),
        sa.Column("author_role",  sa.String(100)),
        sa.Column("avatar_url",   sa.String(512)),
        sa.Column("content_i18n", postgresql.JSON, nullable=False),
        sa.Column("rating",       sa.Float,       nullable=False, server_default="5.0"),
        sa.Column("status",       sa.String(20),  nullable=False, server_default="published"),
        sa.Column("created_at",   sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at",   sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )

    # ── blog_posts ─────────────────────────────────────────────────────────────
    op.create_table(
        "blog_posts",
        sa.Column("id",           sa.String(36),  primary_key=True),
        sa.Column("slug",         sa.String(160), nullable=False),
        sa.Column("title_i18n",   postgresql.JSON, nullable=False),
        sa.Column("excerpt_i18n", postgresql.JSON),
        sa.Column("body_i18n",    postgresql.JSON),
        sa.Column("cover_image",  sa.String(512)),
        sa.Column("author_id",    sa.String(36),  sa.ForeignKey("users.id")),
        sa.Column("published_at", sa.DateTime(timezone=True)),
        sa.Column("status",       sa.String(20),  nullable=False, server_default="draft"),
        sa.Column("tags",         postgresql.JSON),
        sa.Column("created_at",   sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at",   sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("uq_blog_posts_slug",    "blog_posts", ["slug"],         unique=True)
    op.create_index("ix_blog_posts_status",  "blog_posts", ["status"])

    # ── audit_logs ─────────────────────────────────────────────────────────────
    op.create_table(
        "audit_logs",
        sa.Column("id",            sa.String(36),  primary_key=True),
        sa.Column("actor_id",      sa.String(36),  sa.ForeignKey("users.id", ondelete="SET NULL")),
        sa.Column("action",        sa.String(100), nullable=False),
        sa.Column("resource_type", sa.String(100), nullable=False),
        sa.Column("resource_id",   sa.String(36)),
        sa.Column("before",        postgresql.JSON),
        sa.Column("after",         postgresql.JSON),
        sa.Column("ip",            sa.String(45)),
        sa.Column("user_agent",    sa.Text),
        sa.Column("created_at",    sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_audit_logs_actor_id",      "audit_logs", ["actor_id"])
    op.create_index("ix_audit_logs_action",        "audit_logs", ["action"])
    op.create_index("ix_audit_logs_resource_type", "audit_logs", ["resource_type"])
    op.create_index("ix_audit_logs_created_at",    "audit_logs", ["created_at"])

    # ── notifications ──────────────────────────────────────────────────────────
    op.create_table(
        "notifications",
        sa.Column("id",         sa.String(36), primary_key=True),
        sa.Column("user_id",    sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("type",       sa.String(50), nullable=False),
        sa.Column("channel",    sa.String(20), nullable=False),
        sa.Column("title_i18n", postgresql.JSON, nullable=False),
        sa.Column("body_i18n",  postgresql.JSON, nullable=False),
        sa.Column("data",       postgresql.JSON),
        sa.Column("read_at",    sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("ix_notifications_user_id", "notifications", ["user_id"])

    # ── feature_flags ──────────────────────────────────────────────────────────
    op.create_table(
        "feature_flags",
        sa.Column("id",          sa.String(36),  primary_key=True),
        sa.Column("key",         sa.String(100), nullable=False),
        sa.Column("enabled",     sa.Boolean,     nullable=False, server_default="false"),
        sa.Column("rollout_pct", sa.Float,       nullable=False, server_default="0.0"),
        sa.Column("conditions",  postgresql.JSON),
        sa.UniqueConstraint("key", name="uq_feature_flags_key"),
    )
    op.create_index("ix_feature_flags_key", "feature_flags", ["key"], unique=True)


def downgrade() -> None:
    op.drop_table("feature_flags")
    op.drop_table("notifications")
    op.drop_table("audit_logs")
    op.drop_table("blog_posts")
    op.drop_table("testimonials")
    op.drop_table("faqs")
    op.execute("ALTER TABLE commissions DROP CONSTRAINT IF EXISTS fk_commissions_payout_id")
    op.drop_table("payouts")
    op.drop_table("commissions")
    op.drop_table("booking_documents")
    op.drop_table("booking_payments")
    op.drop_table("booking_travelers")
    op.drop_table("reviews")
    op.drop_table("bookings")
    op.drop_table("package_media")
    op.drop_table("package_pricing_rules")
    op.drop_table("package_hotels")
    op.drop_table("package_itinerary_days")
    op.drop_table("packages")
    op.drop_table("hotels")
    op.drop_table("attractions")
    op.drop_table("destinations")
    op.drop_table("agency_staff")
    op.drop_table("agencies")
    op.drop_table("user_roles")
    op.drop_table("users")
