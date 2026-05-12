# AUDIT REPORT — Umrah & Hajj SaaS Platform

| Field | Value |
|---|---|
| **Commit SHA** | N/A — no git history (working directory only) |
| **Audit Date** | 2026-04-22 |
| **Auditor** | Claude Code (Automated Technical Audit) |
| **Phase Audited** | Phase 1 — Core Platform |
| **Codebase Path** | `d:/umrah/` |

---

## Executive Summary

The platform has a **solid architectural skeleton** with well-structured models, bilingual i18n, and a FastAPI+Next.js 14 foundation. However, it is **not deployable or verifiable as specified** because critical implementation gaps exist across security, testing, workers, migrations, and several domain-specific requirements. The overall verdict is:

> **REJECTED — APPROVED WITH CONDITIONS after remediating CRITICAL and HIGH findings**

---

## Score Totals

| Section | ✅ PASS | ⚠️ PARTIAL | ❌ FAIL | ⛔ N/A |
|---|---|---|---|---|
| 1. Environment & Build | 2 | 3 | 4 | 0 |
| 2. Tech Stack | 6 | 4 | 5 | 2 |
| 3. Multi-Tenancy | 0 | 1 | 5 | 0 |
| 4. Auth & Authorization | 3 | 3 | 6 | 1 |
| 5. Domain Rules (Umrah/Hajj) | 4 | 4 | 8 | 0 |
| 6. Database Schema | 5 | 3 | 5 | 0 |
| 7. Marketing Site | 5 | 4 | 7 | 0 |
| 8. Search & Filter | 2 | 2 | 4 | 0 |
| 9. Package Detail | 2 | 2 | 5 | 0 |
| 10. Cart & Checkout | 2 | 2 | 4 | 0 |
| 11. Customer Portal | 0 | 1 | 9 | 0 |
| 12. Agency Dashboard | 3 | 2 | 9 | 0 |
| 13. Super Admin Panel | 0 | 0 | 14 | 0 |
| 14. Design System | 4 | 2 | 3 | 0 |
| 15. RTL & i18n | 4 | 2 | 4 | 0 |
| 16. Animation Spec | 3 | 3 | 9 | 0 |
| 17. Security | 1 | 2 | 11 | 0 |
| 18. Performance | 0 | 2 | 8 | 0 |
| 19. SEO | 3 | 2 | 5 | 0 |
| 20. Analytics | 0 | 0 | 6 | 0 |
| 21. Testing | 0 | 0 | 7 | 0 |
| 22. DevOps & CI/CD | 0 | 1 | 7 | 0 |
| 23. Accessibility | 1 | 2 | 7 | 0 |
| 24. Acceptance Criteria | 0 | 0 | 3 | 0 |
| **TOTAL** | **50** | **47** | **156** | **3** |

---

## Top 5 CRITICAL Findings

### CRIT-01 — Multi-Tenancy: Zero Row-Level Security (RLS) on Database
**Severity:** CRITICAL — Business-ending data leakage  
**Evidence:** `d:/umrah/backend/alembic/versions/` is **empty** — no migrations have been created or run. No `pg_policies` can exist on an un-migrated schema. The `set_tenant_context` middleware in `main.py:48-51` is a stub that does nothing (`return await call_next(request)`). Repository layer has no `tenant_id` filtering — `packages.py` queries only use `Package.status == "published"` with no agency-scoping on reads from other tenants.  
**Risk:** Any authenticated user can enumerate any other agency's data by guessing IDs.

### CRIT-02 — Alembic Migrations Empty — Database Schema Never Applied
**Severity:** CRITICAL — Application cannot start against a real DB  
**Evidence:** `d:/umrah/backend/alembic/versions/` contains zero `.py` files (verified by `ls -la`). Running `docker compose up` triggers `alembic upgrade head` but there is nothing to apply. The DB remains empty. No tables exist.  
**Risk:** Every API endpoint that touches the DB will return 500.

### CRIT-03 — PII Encryption is Base64, Not Encryption
**Severity:** CRITICAL — Compliance / GDPR / PDPL violation  
**Evidence:** `d:/umrah/backend/app/core/security.py:50-56`:
```python
def encrypt_pii(plaintext: str) -> str:
    """AES-256-GCM encryption for PII fields — stub; wire to KMS in production."""
    import base64
    return base64.b64encode(plaintext.encode()).decode()
```
Passport numbers stored via `encrypt_pii()` in `bookings.py` are trivially reversible with `base64.b64decode`. This is not encryption.  
**Risk:** Passport numbers, medical notes are exposed in plain sight to anyone with DB read access.

### CRIT-04 — Hajj Quota Race Condition — Oversell Possible
**Severity:** CRITICAL — Financial and legal liability  
**Evidence:** `d:/umrah/backend/app/api/v1/bookings.py:52-55`:
```python
if pkg.hajj_quota is not None:
    remaining = pkg.hajj_quota - pkg.hajj_quota_used
    if remaining < ...:
        raise HTTPException(...)
    pkg.hajj_quota_used += ...
```
This is a read-modify-write without a DB-level lock. Two concurrent requests will both read the same `hajj_quota_used`, both pass the check, and both commit — overselling the quota. No `SELECT FOR UPDATE` or advisory lock is used. The comment `(atomic via advisory lock in production)` is aspirational, not implemented.  
**Risk:** More pilgrims booked than physical Hajj slots exist, violating Ministry quotas.

### CRIT-05 — Celery Worker Has No Tasks — Notifications/Emails Never Sent
**Severity:** CRITICAL — Bookings, confirmations, OTP all silently fail  
**Evidence:** `d:/umrah/backend/app/workers/` directory exists but is **empty** (zero files). `docker-compose.yml:77` references `app.workers.celery_app` which does not exist. Worker container will crash on start. All `# TODO: send email verification via Celery task` comments (e.g. `auth.py:63`) mean no emails are ever sent.  
**Risk:** Users receive no booking confirmation, no OTP, no agency approval email. Core booking flow broken.

---

## All HIGH Findings

### HIGH-01 — No Admin Panel Pages Exist
**Severity:** HIGH  
**Evidence:** `find d:/umrah/frontend/app -name "page.tsx"` returns 7 pages total. `app/[locale]/(admin)/` route group has no `page.tsx` files at all — no dashboard, no agency approval, no package review queue, no user management. The `(admin)` route group under `frontend/app/` contains only empty subdirectory stubs.  
**Remediation:** Build all pages in `app/[locale]/(admin)/` per spec §6.8.

### HIGH-02 — No Customer Portal Pages Exist
**Severity:** HIGH  
**Evidence:** Same `find` output — `app/[locale]/(customer)/` has no `page.tsx` files. My Bookings, Wishlist, Profile, Document Upload are all missing.  
**Remediation:** Build all pages in `app/[locale]/(customer)/` per spec §6.6.

### HIGH-03 — Refresh Token Rotation Not Implemented
**Severity:** HIGH  
**Evidence:** `auth.py` sets cookies on login/register but has no `/refresh` endpoint. The `api.ts` interceptor calls `/auth/refresh` on 401 but that route does not exist in `router = APIRouter(prefix="/auth", ...)`. Refresh tokens stored in cookies but never validated or rotated.  
**Remediation:** Implement `/auth/refresh` with token rotation and Redis blocklist for revoked tokens.

### HIGH-04 — No Rate Limiting Implemented
**Severity:** HIGH  
**Evidence:** `config.py` defines `RATE_LIMIT_AUTH = "5/minute"` but no rate-limit middleware is registered in `main.py`. No `slowapi`, `fastapi-limiter`, or Redis-based token bucket is installed or wired up.  
**Remediation:** Install `fastapi-limiter` or `slowapi`, register middleware, apply to `/auth/*`, `/search/*`, `/bookings`.

### HIGH-05 — No Tests Written
**Severity:** HIGH  
**Evidence:** `d:/umrah/backend/tests/unit/`, `tests/integration/` are empty directories. No pytest files. No Playwright E2E tests. No Vitest tests in frontend. The entire test strategy from spec §15 is absent.  
**Remediation:** Write unit tests for services, integration tests for auth+booking flows, E2E for critical path.

### HIGH-06 — Package Detail Page Missing
**Severity:** HIGH  
**Evidence:** `find` output shows no `app/[locale]/(marketing)/packages/[slug]/page.tsx`. The `tours/[slug]/page.tsx` exists but is not at the correct route. Gallery, sticky booking widget, itinerary, Ziyarah sites, inclusions/exclusions, cancellation policy — all absent.  
**Remediation:** Create `app/[locale]/(marketing)/packages/[slug]/page.tsx` per spec §6.4.

### HIGH-07 — Agency Package Wizard Not Built
**Severity:** HIGH  
**Evidence:** `app/[locale]/(agency)/` has `dashboard/page.tsx` but no package creation wizard. The 8-step flow (Basics → Itinerary → Accommodation → Transportation → Pricing → Media → Policies → Publish) does not exist.  
**Remediation:** Build the wizard at `app/[locale]/(agency)/packages/new/page.tsx`.

### HIGH-08 — Gender Segregation for Rooms Not Enforced
**Severity:** HIGH  
**Evidence:** `booking.py` creates bookings without checking traveler gender against room type. No room-type enum in any model. No rejection logic for male booking female-only rooms.  
**Remediation:** Add `room_gender_restriction` to `PackageHotel` model; enforce in booking creation.

### HIGH-09 — Mahram Requirement Warning Not Implemented
**Severity:** HIGH — Domain-critical Umrah rule  
**Evidence:** `BookingTraveler` has `mahram_relation` field but no business logic checks traveler age+gender against country-of-origin Mahram requirements.  
**Remediation:** Add `MahramRule` table keyed by country; validate in booking creation service.

### HIGH-10 — No CI/CD Pipeline
**Severity:** HIGH  
**Evidence:** No `.github/workflows/` directory exists anywhere in the repository. No lint, typecheck, test, or build gates on PRs.  
**Remediation:** Add GitHub Actions workflows per spec §16.

### HIGH-11 — `/docs` OpenAPI Exposed in All Environments
**Severity:** HIGH  
**Evidence:** `main.py:24`: `docs_url="/api/docs" if not settings.is_production else None`. In development (`ENVIRONMENT=development`), OpenAPI UI is accessible. Per spec §17.2 A05, it should be protected or disabled even in staging. Currently docker-compose sets `ENVIRONMENT=development` permanently.  
**Remediation:** Gate OpenAPI behind an env-level flag; protect staging with HTTP basic auth.

---

## MEDIUM Findings (Appendix A)

| ID | Section | Finding | Severity | File / Evidence |
|---|---|---|---|---|
| MED-01 | §6 DB | No `flight_searches`, `flight_offers` tables in models | MEDIUM | No `catalog.py` flight models |
| MED-02 | §6 DB | No `wishlist` table in any model file | MEDIUM | grep wishlist in models/* = 0 hits |
| MED-03 | §6 DB | GIN indexes on i18n JSONB columns not defined | MEDIUM | No `GIN` index in any model `__table_args__` |
| MED-04 | §6 DB | Full-text search index not defined on package title/description | MEDIUM | No `func.to_tsvector` index |
| MED-05 | §6 DB | `PostGIS geometry` column (`location`) not on hotels — only float lat/lng | MEDIUM | `catalog.py:Hotel` uses Float lat/lng, no GeoAlchemy2 Geometry column |
| MED-06 | §2.4 | No abstract provider interfaces (FlightProvider, PaymentGateway, etc.) | MEDIUM | `app/integrations/` dir does not exist |
| MED-07 | §2.2 | Celery `celery_app` module referenced but not created | MEDIUM | `workers/` is empty |
| MED-08 | §4.1 | `preferred_language` stored but `Tajawal` font not loaded in font list | MEDIUM | `layout.tsx` loads `IBM_Plex_Sans_Arabic` not `Tajawal` |
| MED-09 | §7.1 | "Special Offers" section missing from homepage | MEDIUM | `page.tsx` has no `<SpecialOffersSection>` |
| MED-10 | §7.1 | "Trusted By" logo strip missing from homepage | MEDIUM | No `TrustedBySection` component |
| MED-11 | §7.1 | "Start Planning" tabs not wired to real data — all mock | MEDIUM | `PlanningSection.tsx` hardcoded |
| MED-12 | §8.1 | FAQ categories do not match spec (Booking, Renting vs Umrah-specific) | MEDIUM | `faq/page.tsx:CATEGORIES` generic |
| MED-13 | §5 Domain | Qurbani/Udhiyah add-on field absent from Package model | MEDIUM | No `qurbani_available` in `catalog.py` |
| MED-14 | §5 Domain | `suhoor_iftar_available` flag absent from Package model | MEDIUM | No Ramadan flag |
| MED-15 | §5 Domain | Mutawwif/guide entity not normalized — stored as JSON blob in `guide_info` | MEDIUM | `Package.guide_info = JSON` |
| MED-16 | §5 Domain | Ziyarah sites referenced by JSON in itinerary, not by FK to `attractions` | MEDIUM | `PackageItineraryDay.attractions = JSON` |
| MED-17 | §5 Domain | Nusuk/Tasreeh webhook endpoints absent | MEDIUM | No route in `api/v1/` |
| MED-18 | §10 Checkout | Card number collected in frontend form field — PCI violation risk | MEDIUM | `checkout/page.tsx:cardNumber` field exists in Zod schema — must use Stripe.js Elements |
| MED-19 | §17 Security | No webhook signature verification for Stripe | MEDIUM | No endpoint in `bookings.py` or elsewhere |
| MED-20 | §17 Security | No CSRF protection | MEDIUM | No CSRF middleware in `main.py` |
| MED-21 | §17 Security | No HSTS/CSP/security headers configured in nginx | MEDIUM | `infra/nginx/default.conf` has no security headers |
| MED-22 | §19 SEO | No `sitemap.xml` route | MEDIUM | No `app/sitemap.ts` in Next.js |
| MED-23 | §19 SEO | No `robots.txt` | MEDIUM | Not found in `public/` or `app/` |
| MED-24 | §19 SEO | No JSON-LD structured data on any page | MEDIUM | No `<script type="application/ld+json">` in any page |
| MED-25 | §20 Analytics | No PostHog/Plausible integration | MEDIUM | Not in `package.json` |
| MED-26 | §14 Design | Storybook listed in `package.json` but no stories written | MEDIUM | No `.stories.tsx` files |
| MED-27 | §22 DevOps | No `.env.example` file in backend or frontend | MEDIUM | Checked both dirs |
| MED-28 | §22 DevOps | No feature flags seeded or guarding any feature | MEDIUM | `FeatureFlag` model exists, no usage |
| MED-29 | §17.6 | No GDPR data export endpoint | MEDIUM | Not in any API router |
| MED-30 | §17.6 | No `security.txt` at `/.well-known/security.txt` | MEDIUM | Not in `public/` |

---

## LOW Findings (Appendix B)

| ID | Finding | File |
|---|---|---|
| LOW-01 | `PopularThingsSection` uses hardcoded English strings, not i18n keys | `page.tsx:51-65` |
| LOW-02 | Hero section badge "Ministry of Hajj & Umrah — Official Platform" is hardcoded, not translated | `HeroSection.tsx:51` |
| LOW-03 | FAQ questions and answers are placeholder Lorem Ipsum text | `faq/page.tsx:FAQS` |
| LOW-04 | Package list page uses 100% mock data (`MOCK` array) — not wired to API | `packages/page.tsx:MOCK` |
| LOW-05 | Checkout page uses hardcoded trip summary — not wired to cart store | `checkout/page.tsx:TRIP` |
| LOW-06 | Sign-in page has hardcoded trip summary for sidebar — irrelevant to auth | `sign-in/page.tsx` |
| LOW-07 | Hero images, package images, agency logos all missing from `public/images/` | Only `logo.png` and `placeholder-package.jpg` exist |
| LOW-08 | No `README.md` at project root with quickstart instructions | Root has no README |
| LOW-09 | No `LICENSE` file | Root dir |
| LOW-10 | `docs/` directory is empty | Spec §1.3 requires architecture + API overview |
| LOW-11 | `ui/` components directory is completely empty — shadcn/ui installed but no components generated | `components/ui/` empty |
| LOW-12 | `dashboard/` components directory is completely empty | `components/dashboard/` empty |
| LOW-13 | `alembic.ini` present but `script_location` may not be correctly set | Review if `versions/` path is correct |
| LOW-14 | Payment logos referenced in checkout (`/images/payments/paypal.svg`, etc.) don't exist in `public/` | 404 on all payment icons |

---

## Overall Verdict

**REJECTED**

The platform demonstrates strong architectural intent and correct technology choices, but is not deployable in its current state. The five CRITICAL issues (no DB migrations, no real encryption, RLS absent, quota race condition, broken workers) and eleven HIGH issues mean the platform cannot safely handle real user data or process bookings. Phase 1 requires complete remediation of all CRITICAL and HIGH items before re-audit.
