# Remediation Backlog — Umrah & Hajj Platform

Ordered by severity. CRITICAL items block all Phase 1 acceptance.

---

## CRITICAL (Block Deployment)

| # | ID | Title | File(s) | Suggested Fix |
|---|---|---|---|---|
| 1 | CRIT-02 | Generate Alembic migration from existing models | `backend/alembic/versions/` | Run `alembic revision --autogenerate -m "initial_schema"` inside backend container. Verify all tables created. |
| 2 | CRIT-05 | Create Celery app and basic tasks | `backend/app/workers/celery_app.py` | Create `celery_app.py` with Celery instance. Add `send_booking_confirmation`, `send_email_verification` tasks using SendGrid. |
| 3 | CRIT-01 | Implement RLS on all tenant-scoped tables | Alembic migration + `main.py` | Add `SET app.current_tenant_id` in tenant middleware. Add RLS policies in migration. Scope all agency-owned queries by `agency_id`. |
| 4 | CRIT-03 | Replace base64 PII stub with real AES-256-GCM | `backend/app/core/security.py:44-56` | Use `cryptography.hazmat.primitives.ciphers.aead.AESGCM`. Store key in env/KMS. Re-encrypt any test data. |
| 5 | CRIT-04 | Fix Hajj quota race condition | `backend/app/api/v1/bookings.py:52-55` | Use `SELECT ... FOR UPDATE` via SQLAlchemy `with_for_update()` or Postgres advisory lock `pg_try_advisory_xact_lock(package_id_hash)`. |

---

## HIGH (Required for Phase 1 DoD)

| # | ID | Title | File(s) | Suggested Fix |
|---|---|---|---|---|
| 6 | HIGH-03 | Implement `/auth/refresh` with token rotation | `backend/app/api/v1/auth.py` | Add `POST /auth/refresh` endpoint. Validate refresh token, issue new pair, add old refresh to Redis blocklist. |
| 7 | HIGH-04 | Add rate limiting middleware | `backend/app/main.py` | Install `fastapi-limiter`. Apply `@limiter.limit("5/minute")` to auth, `60/minute` to search, `10/minute` to bookings. |
| 8 | HIGH-01 | Build Super Admin Panel pages | `frontend/app/[locale]/(admin)/` | Create dashboard, agencies, packages, users, reports pages per spec §6.8. |
| 9 | HIGH-02 | Build Customer Portal pages | `frontend/app/[locale]/(customer)/` | Create bookings, profile, wishlist, reviews pages per spec §6.6. |
| 10 | HIGH-06 | Build Package Detail page | `frontend/app/[locale]/(marketing)/packages/[slug]/page.tsx` | Gallery, sticky booking widget, itinerary, hotel cards, reviews per spec §6.4. |
| 11 | HIGH-07 | Build Agency Package Wizard | `frontend/app/[locale]/(agency)/packages/new/page.tsx` | 8-step wizard with stepper component per spec §6.7. |
| 12 | HIGH-08 | Enforce room gender segregation | `backend/app/models/catalog.py`, `bookings.py` | Add `room_gender_restriction` enum to `PackageHotel`. Validate in `create_booking()`. |
| 13 | HIGH-09 | Implement Mahram requirement logic | New `MahramRule` model + `bookings.py` | Add country-keyed rules table. Warn (not block) on female traveler under 45 without Mahram. |
| 14 | HIGH-10 | Create GitHub Actions CI pipeline | `.github/workflows/ci.yml` | Lint, typecheck, test, build on every PR. Block merge on failure. |
| 15 | HIGH-11 | Protect OpenAPI in non-production | `backend/app/main.py`, `docker-compose.yml` | Add HTTP basic auth to `/api/docs` in staging. Only expose in `ENVIRONMENT=development`. |

---

## MEDIUM (Required Before GA)

| # | ID | Title | Suggested Fix |
|---|---|---|---|
| 16 | MED-01 | Add `FlightSearch`/`FlightOffer` models | Add to `catalog.py` or new `flights.py` |
| 17 | MED-02 | Add `Wishlist` table | New model: `user_id + package_id`, unique constraint |
| 18 | MED-03 | Add GIN indexes on i18n JSONB columns | In `__table_args__` of each model: `Index("...", col, postgresql_using="gin")` |
| 19 | MED-04 | Add full-text search tsvector index | Add `func.to_tsvector` GIN index on `packages.title_i18n` |
| 20 | MED-05 | Add PostGIS geometry column to hotels | Replace Float lat/lng with `geoalchemy2.Geometry("POINT")` |
| 21 | MED-06 | Create abstract provider interfaces | `backend/app/integrations/base.py` — `FlightProvider`, `PaymentGateway`, `SMSProvider`, `EmailProvider` |
| 22 | MED-13/14 | Add `qurbani_available`, `suhoor_iftar_available` to Package | Add boolean columns to `catalog.py:Package` |
| 23 | MED-16 | Normalize Ziyarah sites as FK | Change `PackageItineraryDay.attractions` from JSON to many-to-many with `attractions` table |
| 24 | MED-17 | Add Nusuk/Tasreeh webhook stubs | Add `POST /webhooks/nusuk` and `POST /webhooks/tasreeh` as documented stubs |
| 25 | MED-18 | Fix PCI — use Stripe.js Elements | Remove `cardNumber` from Zod schema. Embed `<CardElement>` from `@stripe/react-stripe-js` |
| 26 | MED-19 | Add Stripe webhook with signature verification | `POST /webhooks/stripe` with `stripe.Webhook.construct_event()` |
| 27 | MED-21 | Add security headers to Nginx | Add HSTS, CSP, X-Frame-Options, X-Content-Type-Options to `infra/nginx/default.conf` |
| 28 | MED-22/23 | Add `sitemap.ts` and `robots.txt` | `frontend/app/sitemap.ts` (dynamic), `frontend/public/robots.txt` |
| 29 | MED-24 | Add JSON-LD structured data | Add `TouristTrip`, `Organization`, `FAQPage`, `BreadcrumbList` schemas |
| 30 | MED-25 | Integrate analytics | Add PostHog or Plausible. Fire events on search, view_package, complete_booking |
| 31 | MED-27 | Create `.env.example` files | `backend/.env.example` and `frontend/.env.example` listing all required vars |
| 32 | MED-29 | GDPR data export endpoint | `GET /api/v1/users/me/data-export` — returns all user PII as JSON |
| 33 | MED-30 | Add `security.txt` | `frontend/public/.well-known/security.txt` |

---

## LOW (Polish Before Launch)

| # | ID | Title | Suggested Fix |
|---|---|---|---|
| 34 | LOW-01 | i18n `PopularThingsSection` | Move strings to `locales/*/index.json` under `home.things` |
| 35 | LOW-02 | i18n Hero badge | Extract "Ministry of Hajj & Umrah — Official Platform" to translation key |
| 36 | LOW-03 | Replace Lorem Ipsum FAQ content | Populate with real Umrah/Hajj FAQ content in Arabic and English |
| 37 | LOW-04/05/06 | Wire pages to real API | Remove all `MOCK` data arrays; connect to TanStack Query hooks |
| 38 | LOW-07 | Add hero and placeholder images | Add `hero-bg.jpg`, package/destination images, agency logos |
| 39 | LOW-08 | Write README.md | Quickstart, architecture diagram, env vars, development workflow |
| 40 | LOW-09 | Add LICENSE | MIT or as appropriate |
| 41 | LOW-10 | Write `docs/` content | Architecture overview, API overview per spec §1.3 |
| 42 | LOW-11 | Generate shadcn/ui components | Run `npx shadcn-ui@latest add button card dialog input label ...` |
| 43 | LOW-12 | Build dashboard components | `components/dashboard/` — KPICard, BookingsTable, RevenueChart |
| 44 | LOW-14 | Add payment logo assets | Add `public/images/payments/*.svg` for all payment methods shown in checkout |
