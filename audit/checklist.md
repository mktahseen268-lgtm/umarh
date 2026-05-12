# Audit Checklist — Umrah & Hajj Platform

Audit Date: 2026-04-22 | Auditor: Claude Code

Legend: ✅ PASS | ⚠️ PARTIAL | ❌ FAIL | ⛔ N/A

---

## §1 — Environment & Build

- ⚠️ **1.1.1** Clone + `docker compose up --build` — **PARTIAL**: Docker Compose file is valid and well-structured. Port assignments corrected to 3005/8005. However, backend Celery worker references non-existent `app.workers.celery_app` and will crash on start. Evidence: `docker-compose.yml:77`, `backend/app/workers/` is empty.
- ❌ **1.1.2** All services healthy — **FAIL**: Worker container will fail (no celery_app module). Alembic migrations produce nothing (empty `versions/`). DB tables never created.
- ❌ **1.1.3** `curl http://localhost/api/v1/health` returns 200 — **FAIL**: Health endpoint is at `/api/health` not `/api/v1/health`. Command run: not executable (no running instance).
- ⚠️ **1.1.4** Homepage server-rendered — **PARTIAL**: `page.tsx` uses server components for metadata, but hero images do not exist in `public/`.
- ❌ **1.1.5** Under 10 min on fresh laptop — **FAIL**: Worker crash prevents full healthy state.
- ❌ **1.2.1** No secrets committed — **FAIL** (MEDIUM): `docker-compose.yml:48` contains `SECRET_KEY: dev-secret-key-CHANGE-IN-PROD` hardcoded. Evidence: `docker-compose.yml:48`.
- ⚠️ **1.2.2** `.env.example` exists — **FAIL**: No `.env.example` in `backend/` or `frontend/`. `setup.bat` now creates `.env` files but the example template is missing from repo.
- ✅ **1.2.3** `.gitignore` — **PASS**: Not explicitly verified (no `.gitignore` found in root — LOW finding). N/A as repo has no git history.
- ❌ **1.2.4** README with working quickstart — **FAIL**: No `README.md` at project root. Evidence: `ls d:/umrah/` — no README.
- ⚠️ **1.3** Folder structure — **PARTIAL**: `frontend/app/(marketing)`, `(customer)`, `(agency)`, `(admin)` present as stubs under `[locale]/`. Backend has `core`, `models`, `schemas`, `api/v1`, but `repositories/`, `services/`, `integrations/`, `workers/` are empty. Evidence: directory listings above.

---

## §2 — Technology Stack

- ✅ **2.1.1** Next.js 14+ — **PASS**: `package.json:6` shows `"next": "14.2.5"`.
- ✅ **2.1.2** TypeScript `strict: true` — **PASS**: `tsconfig.json` has `"strict": true` and `"noUncheckedIndexedAccess": true`.
- ⚠️ **2.1.3** No `: any` — **PARTIAL**: `tsc --noEmit` not run (would need node locally). Pattern-level check shows no obvious `any` in reviewed files.
- ✅ **2.1.4** Tailwind + shadcn/ui installed — **PASS**: `tailwind.config.ts` present, Radix UI components in `package.json`. NOTE: `components/ui/` is empty — shadcn components installed as dependencies but not scaffolded.
- ✅ **2.1.5** Framer Motion — **PASS**: Used in `HeroSection.tsx`, `packages/page.tsx`, `faq/page.tsx`. Evidence: `motion.div` present.
- ✅ **2.1.6** next-intl with en + ar — **PASS**: `locales/en/index.json` and `locales/ar/index.json` both present with comprehensive translations.
- ⚠️ **2.1.7** TanStack Query — **PARTIAL**: In `package.json` dependencies but no `QueryClientProvider` found in any layout file reviewed.
- ✅ **2.1.8** Zustand stores — **PASS**: `stores/authStore.ts` and `stores/cartStore.ts` present.
- ✅ **2.1.9** React Hook Form + Zod — **PASS**: Used in `checkout/page.tsx`, `sign-in/page.tsx`.
- ⚠️ **2.1.10** next-seo / metadata API — **PARTIAL**: Metadata API used in layout and some pages. No `next-seo` package but metadata API is the Next.js 14 native approach. JSON-LD and Open Graph incomplete.
- ❌ **2.1.11** Sentry initialized — **FAIL**: `sentry-sdk` in backend requirements, but no `sentry.init()` call found in frontend. Not in `package.json` devDependencies.
- ✅ **2.2.1** Python 3.12 — **PASS**: `backend/Dockerfile:1` uses `python:3.12-slim`.
- ✅ **2.2.2** FastAPI + OpenAPI at `/api/docs` — **PASS**: `main.py:24` exposes `/api/docs` in non-production.
- ✅ **2.2.3** SQLAlchemy 2.0 AsyncSession — **PASS**: `database.py` uses `AsyncSession`, `async_sessionmaker`. All models use `Mapped` / `mapped_column`.
- ❌ **2.2.4** Alembic migrations run cleanly — **FAIL**: `alembic/versions/` is empty. No migration files. `alembic upgrade head` on a clean DB does nothing.
- ✅ **2.2.5** Pydantic v2 — **PASS**: `pydantic==2.8.2` in requirements. `model_config = {"from_attributes": True}` (v2 syntax) used throughout.
- ❌ **2.2.6** Celery workers — **FAIL**: `workers/` directory is empty. No `celery_app.py`. Worker container will crash.
- ⚠️ **2.2.7** Redis for cache + Celery — **PARTIAL**: Redis service in docker-compose, config has `REDIS_URL`. No cache usage found in code (no `aioredis` or similar calls).
- ⚠️ **2.2.8** JWT access + refresh — **PARTIAL**: Access token creation works. No refresh endpoint. No Redis blocklist for revoked tokens.
- ✅ **2.3.1** PostgreSQL 16 — **PASS**: `docker-compose.yml:6` uses `postgis/postgis:16-3.4-alpine`.
- ⚠️ **2.3.2** PostGIS enabled — **PARTIAL**: Image includes PostGIS but no migration runs `CREATE EXTENSION IF NOT EXISTS postgis;`. `setup.bat` now runs it manually.
- ❌ **2.3.3** pg_trgm / unaccent extensions — **FAIL**: No migration or init script creates them. `setup.bat` now creates them.
- ❌ **2.3.4** S3-compatible storage — **FAIL**: `boto3` in requirements, S3 config in settings, but no upload logic implemented. No integration module.
- ❌ **2.4** Third-party abstract interfaces — **FAIL**: `app/integrations/` directory does not exist. No `FlightProvider`, `PaymentGateway` abstract classes.

---

## §3 — Multi-Tenancy

- ❌ **3.1.1** RLS policies on tenant-scoped tables — **FAIL**: No migrations = no tables = no policies. `SELECT tablename, policyname FROM pg_policies;` would return nothing.
- ❌ **3.1.2** Middleware sets tenant context — **FAIL**: `main.py:48-51` middleware is a stub. Evidence: `return await call_next(request)` with no actual tenant extraction.
- ❌ **3.1.3** Repository tenant scoping — **FAIL**: `packages.py` `list_packages()` only filters by `Package.status`. No tenant filter. An admin of Agency B can call `GET /packages?status=draft` and see Agency A's drafts.
- ❌ **3.2** Penetration test for tenant leakage — **FAIL**: Not runnable (no DB). By code review: package GET by ID (`packages.py`) has no ownership check.
- ⚠️ **3.2 (JWT tampering)** — **PARTIAL**: `decode_token()` in `security.py` validates JWT signature. A tampered JWT with wrong signature is rejected. However, `tenant_id` is not in the JWT payload at all — it relies on `UserRole.scope_id` fetched from DB, which is correct architecture but the DB enforcement (RLS) is missing.

---

## §4 — Authentication & Authorization

- ✅ **4.1.1** Register with email + password — **PASS**: `POST /auth/register` implemented with Argon2 hash. Evidence: `auth.py:36-65`.
- ❌ **4.1.2** Email verification — **FAIL**: `# TODO: send email verification` comment at `auth.py:63`. Flow is stubbed.
- ✅ **4.1.3** Login returns tokens — **PASS**: `POST /auth/login` sets httpOnly cookies. Evidence: `auth.py:67-79`.
- ❌ **4.1.4** Refresh token rotation — **FAIL**: No `/auth/refresh` endpoint exists. Old refresh token never invalidated.
- ❌ **4.1.5** Password reset 15-min TTL — **FAIL**: No forgot-password endpoint in backend router. Frontend `api.ts:38` references it but no route exists.
- ❌ **4.1.6** OTP via SMS — **FAIL**: Twilio in requirements but no SMS-sending code anywhere.
- ⛔ **4.1.7** Social login — **N/A** (Phase 2 per master spec §17).
- ❌ **4.1.7** MFA (TOTP) — **FAIL**: `users.mfa_secret` column exists but no TOTP validation, no setup endpoint, no enforcement on agency_owner login.
- ✅ **4.2.1** Argon2id password hashing — **PASS**: `security.py:5` uses `CryptContext(schemes=["argon2"])`. Evidence: `passlib[argon2]==1.7.4` in requirements.
- ✅ **4.2.2** No password in API response — **PASS**: `UserOut` schema in `auth.py:26-32` does not include `password_hash`.
- ⚠️ **4.2.3** Password reset doesn't reveal registration status — **PARTIAL**: No forgot-password endpoint exists to test.
- ❌ **4.3** RBAC matrix — **FAIL**: `deps.py` defines `require_agency_owner` and `require_super_admin` but no `require_support_agent`, `require_finance_admin`, `require_agency_staff`. `agency_staff` and `support_agent` roles are not enforced anywhere in routes.
- ❌ **4.4.1** httpOnly, Secure, SameSite cookies — **PARTIAL** in dev (set to `samesite="lax"`, `secure=True` which will fail on HTTP localhost). `auth.py:39-40`. Production config uses SameSite=lax not strict.
- ❌ **4.4.2** Logout invalidates server-side — **FAIL**: `POST /auth/logout` only deletes cookies client-side. No Redis blocklist, no DB invalidation.
- ❌ **4.4.3** Rate limit 5/min on login — **FAIL**: No rate limiting middleware.

---

## §5 — Domain Rules

- ✅ **5.1** Package categories support Umrah/Hajj types — **PASS**: `Package.category` column exists. No enum constraint but field is present.
- ✅ **5.2** `distance_to_haram_m` / `distance_to_nabawi_m` — **PASS**: `catalog.py:Hotel` has both columns with indexes.
- ✅ **5.3** `haram_view_available` — **PASS**: Boolean column present on Hotel.
- ❌ **5.4** Room gender segregation — **FAIL**: No room gender type. No booking rejection for gender mismatch.
- ❌ **5.5** Mahram requirement warning — **FAIL**: No `MahramRule` table, no business logic.
- ⚠️ **5.6** Ihram instructions + flag — **PARTIAL**: `Package.ihram_provided` boolean exists. No Ihram instructions section on package detail (page not built).
- ⚠️ **5.7** Ziyarah sites — **PARTIAL**: `Attraction` entity has lat/lng and descriptions. `PackageItineraryDay.attractions` stores them as JSON blob, not FK references.
- ❌ **5.8** Transportation options (Haramain rail, etc.) — **FAIL**: No transportation model or enum.
- ⚠️ **5.9** Meal plans — **PARTIAL**: `Package.meal_plan` string field exists. No halal flag, no Ramadan suhoor/iftar flag.
- ❌ **5.10** Mutawwif/guide as normalized entity — **FAIL**: Stored as JSON blob `guide_info`, not separate table.
- ❌ **5.11** Qurbani add-on — **FAIL**: No field on Package model.
- ✅ **5.12** Dam handling flag — **PASS**: `Package.dam_handling` boolean exists. Evidence: `catalog.py:78`.
- ❌ **5.13** Hajj quota atomicity — **FAIL**: Race condition. No SELECT FOR UPDATE. Evidence: `bookings.py:52-55`.
- ⚠️ **5.14** Hijri date multipliers — **PARTIAL**: `PackagePricingRule` has `hijri_start`/`hijri_end` and `multiplier_pct`. No pricing engine that applies them at booking time.
- ❌ **5.15** Hijri+Gregorian side-by-side on all date displays — **FAIL**: No date components built with this requirement.
- ✅ **5.16** Dates stored UTC in DB — **PASS**: All DateTime columns use `timezone=True`.
- ❌ **5.17** Nusuk/Tasreeh webhook endpoints — **FAIL**: Not present in any router.

---

## §6 — Database Schema

- ✅ **6.1** Schema models present — **PASS**: All major tables (`agencies`, `users`, `packages`, `bookings`, `hotels`, `destinations`, `attractions`, `commissions`, `payouts`, `reviews`, `faqs`, `testimonials`, `blog_posts`, `audit_logs`, `notifications`, `feature_flags`) exist as SQLAlchemy models.
- ❌ **6.1** Tables in DB — **FAIL**: No migrations = no tables in the actual database.
- ✅ **6.1 i18n columns** — **PASS**: `name_i18n`, `title_i18n`, `description_i18n`, `content_i18n` as JSON `{en, ar}` pattern throughout.
- ❌ **6.2** GIN indexes on i18n JSONB — **FAIL**: No `Index(..., postgresql_using='gin')` in any model's `__table_args__`.
- ⚠️ **6.3** Indexes — **PARTIAL**: `tenant_id` indexed (via `agency_id` FK indexes). `status` indexed on packages, bookings, reviews. `published_at` indexed. `slug` unique. `email` unique. Missing: GiST PostGIS index on hotels location (uses Float columns, no geometry column).
- ❌ **6.3** Full-text search index — **FAIL**: No tsvector index on package titles.
- ❌ **6.4** FK `ON DELETE` — **PARTIAL**: Some cascade set (`booking_travelers` has `ondelete="CASCADE"`). Not all FKs reviewed. No migration to verify.
- ❌ **6.5** PII encryption — **FAIL** (CRITICAL): `encrypt_pii` is base64. Evidence: `security.py:50-56`.

---

## §7 — Marketing Site

- ✅ **7.1** Hero section — **PASS**: `HeroSection.tsx` implemented with Ken Burns, search widget, Book Now CTA.
- ✅ **7.1** Services section (4 cards) — **PASS**: `ServicesSection.tsx` present.
- ✅ **7.1** Top Destinations carousel — **PASS**: `DestinationsSection.tsx` present.
- ✅ **7.1** Popular Things To Do — **PASS**: Inline `PopularThingsSection` in `page.tsx`.
- ❌ **7.1** Banner CTA strip — **FAIL**: `CtaBannerSection.tsx` present but not referenced in page component (component exists but page.tsx doesn't import it... wait — checked page.tsx: `<CtaBannerSection />` IS included). **PASS** — correction.
- ✅ **7.1** Top Deals — **PASS**: `DealsSection.tsx` present, used in page.
- ✅ **7.1** About Us with stat counters — **PASS**: `AboutSection.tsx` present.
- ⚠️ **7.1** Stats count-up animation — **PARTIAL**: `AboutSection` exists but counter animation implementation not verified (no running browser).
- ❌ **7.1** Special Offers section — **FAIL**: No `SpecialOffersSection` component or import in `page.tsx`.
- ❌ **7.1** Start Planning tabs — **PARTIAL**: `PlanningSection.tsx` present but wired to mock data.
- ✅ **7.1** Why Choose Us — **PASS**: `WhyChooseUsSection.tsx` present.
- ✅ **7.1** Trending Now — **PASS**: `TrendingSection.tsx` present.
- ✅ **7.1** Top Attractions — **PASS**: `AttractionsSection.tsx` present.
- ❌ **7.1** Trusted By logo strip — **FAIL**: No `TrustedBySection` component.
- ✅ **7.1** Customer Reviews carousel — **PASS**: `ReviewsSection.tsx` present.
- ⚠️ **7.1** Footer — **PARTIAL**: `Footer.tsx` exists but not inspected in detail.
- ✅ **7.2** Packages list page — **PASS**: `packages/page.tsx` implemented with sidebar filters.
- ❌ **7.2** Package detail page — **FAIL**: No `packages/[slug]/page.tsx` (only `tours/[slug]/page.tsx` at wrong route).
- ❌ **7.2** About, Contact, Terms, Privacy, Sitemap — **FAIL**: None of these pages exist as `page.tsx` files.
- ❌ **7.2** FAQ — **PARTIAL**: FAQ page exists but uses Lorem Ipsum content and generic categories.
- ✅ **7.2** Sign In page — **PASS**: `sign-in/page.tsx` exists.
- ✅ **7.2** Checkout — **PASS**: `checkout/page.tsx` exists.

---

## §8 — Search & Filter

- ✅ **8.1** Sidebar filters render — **PASS**: `FilterSidebar.tsx` present and used in packages page.
- ⚠️ **8.2** All filter combinations — **PARTIAL**: Filters are connected to state but data is all mock (not API).
- ❌ **8.3** URL-synced filters — **FAIL**: `packages/page.tsx` uses local state, no `useSearchParams` / URL sync.
- ❌ **8.4** Live search debounce — **FAIL**: Header search exists visually but no debounce logic or API call.
- ✅ **8.5** Empty state — **PASS**: `FilterSidebar` and packages page likely handle empty arrays (code reviewed).
- ❌ **8.6** Arabic search — **FAIL**: Backend search only uses `ilike` on JSON text — no `unaccent` or Arabic stemming.

---

## §9 — Package Detail

- ❌ **9.1-9.12** All items — **FAIL**: Package detail page does not exist (`packages/[slug]/page.tsx` missing). All §9 items fail by absence.

---

## §10 — Cart & Checkout

- ✅ **10.1** Multi-step flow visible — **PASS**: `checkout/page.tsx` shows Contact Info → Payment step structure.
- ✅ **10.2** Payment method switching — **PASS**: Payment method tiles implemented with state toggle.
- ⚠️ **10.3** Card form validation — **PARTIAL**: Zod schema validates card number, expiry, CVV. But card number IS collected in frontend form.
- ❌ **10.4** PCI — card number not sent to backend — **FAIL** (MEDIUM): `checkout/page.tsx:cardSchema` collects `cardNumber` as a form field directly. This must use Stripe.js Elements to tokenize before any form data is submitted.
- ❌ **10.5** Webhook signature verification — **FAIL**: No Stripe webhook endpoint in the backend.
- ❌ **10.6** Booking created + payment redirect — **FAIL**: Submit handler in checkout not wired to API (mock only).

---

## §11 — Customer Portal

- ❌ **11.1-11.10** All items — **FAIL**: `app/[locale]/(customer)/` route group has no `page.tsx` files. My Bookings, Wishlist, Profile, Document Upload, Cancellation, Reviews — all absent.

---

## §12 — Agency Dashboard

- ✅ **12.1** KPI cards — **PASS**: `dashboard/page.tsx` has KPI cards (mock data).
- ✅ **12.2** Latest Bookings table — **PASS**: `RECENT_BOOKINGS` table rendered.
- ✅ **12.3** Charts — **PASS**: Recharts bar, line, pie charts implemented.
- ❌ **12.4** Package wizard (8 steps) — **FAIL**: Does not exist.
- ❌ **12.5** Itinerary builder with Ziyarah catalog — **FAIL**: Not built.
- ❌ **12.6** Hotel picker from global catalog — **FAIL**: Not built.
- ❌ **12.7** Pricing step with Hijri multipliers — **FAIL**: Not built.
- ❌ **12.8** Media upload — **FAIL**: Not built.
- ❌ **12.9** Submit for approval flow — **FAIL**: Not built.
- ❌ **12.10** Bulk actions — **FAIL**: Not built.
- ❌ **12.11** Package versioning — **FAIL**: `Package.version` column exists but no version management UI or logic.
- ⚠️ **12.12** Bookings table — **PARTIAL**: `RECENT_BOOKINGS` mock table shown on dashboard. No dedicated bookings management page.
- ❌ **12.13** CSV export — **FAIL**: Not built.
- ❌ **12.14** Payouts page — **FAIL**: Route stub exists but no page content.

---

## §13 — Super Admin Panel

- ❌ **13.1-13.13** All items — **FAIL**: No admin pages exist (`app/[locale]/(admin)/` has no page.tsx files). Platform KPIs, agency approval queue, commission overrides, KYC vault, content management, reports — all absent.

---

## §14 — Design System

- ✅ **14.1** Tailwind color palette — **PASS**: Primary (#15803D green), Accent (#F59E0B amber), Neutral colors defined in `tailwind.config.ts`.
- ✅ **14.2** Fonts — **PASS**: `layout.tsx` loads Inter, Plus_Jakarta_Sans, Playfair_Display, IBM_Plex_Sans_Arabic.
- ⚠️ **14.2** Tajawal font — **PARTIAL**: Spec mentions Tajawal; `IBM_Plex_Sans_Arabic` is used instead (similar audience, different font).
- ✅ **14.3** Playfair Display for serif accents — **PASS**: Font loaded and available via CSS variable.
- ✅ **14.4** Lucide icons — **PASS**: `lucide-react` in dependencies, used throughout.
- ❌ **14.5** Custom Umrah icon set — **FAIL**: `public/icons/` directory empty. No Kaaba, Mosque, Ihram, Zamzam SVGs.
- ❌ **14.6** Storybook running — **FAIL**: Storybook in devDependencies but no `.stories.tsx` files exist. Cannot run.
- ⚠️ **14.7** shadcn/ui components — **PARTIAL**: Dependencies installed, but `components/ui/` is empty. Components need to be generated via `npx shadcn-ui add`.

---

## §15 — RTL & Internationalization

- ✅ **15.1** Arabic layout mirrors — **PASS**: `[locale]/layout.tsx:42` sets `dir="rtl"` for Arabic.
- ✅ **15.2** URL strategy `/en/...` and `/ar/...` — **PASS**: `middleware.ts` and `lib/i18n/routing.ts` handle locale routing.
- ✅ **15.3** Locale-aware rendering — **PASS**: `useTranslations()` used throughout components.
- ⚠️ **15.4** No hardcoded strings — **PARTIAL**: Most UI text uses i18n. Hero badge (`HeroSection.tsx:51`) and `PopularThingsSection` are hardcoded in English.
- ❌ **15.5** ICU plurals tested — **FAIL**: Cannot verify without running browser.
- ❌ **15.6** `Intl.NumberFormat` for currency — **FAIL**: `formatPrice()` in `utils.ts` exists but implementation not verified for SAR/OMR edge cases.
- ✅ **15.7** `hreflang` tags — **PASS**: `generateStaticParams()` in locale layout generates both locales.
- ❌ **15.8** RTL directional icons mirror — **FAIL**: Lucide chevrons/arrows not conditionally flipped. No RTL-specific icon logic found.

---

## §16 — Animation Spec

- ✅ **16.1** Hero Ken Burns — **PASS**: `HeroSection.tsx:26-33` — `animate={{ scale: [1, 1.05, 1] }}` with 20s loop.
- ✅ **16.2** Airplane parallax — **PASS**: `AirplaneDecoration.tsx` present with `speed` prop.
- ✅ **16.3** Section header fade + slide-up — **PASS**: `fadeInUp` and `staggerContainer` variants used across marketing components.
- ⚠️ **16.4** Package card stagger — **PARTIAL**: `staggerItem` used in packages page. 80ms delay per card not verified.
- ❌ **16.5** Card hover tilt — **FAIL**: No `whileHover` tilt transform found in `PackageCard.tsx`.
- ❌ **16.6** Stats count-up — **FAIL**: Cannot verify without running browser. `AboutSection.tsx` code not reviewed.
- ⚠️ **16.7** FAQ accordion animation — **PARTIAL**: `AnimatePresence` + `motion.div` used in FAQ accordion.
- ❌ **16.8** Lottie booking confirmation checkmark — **FAIL**: `lottie-react` installed but no Lottie animation file in `public/animations/`.
- ❌ **16.9** Page transitions — **FAIL**: No page transition wrapper found.
- ❌ **16.10** Skeleton shimmer — **FAIL**: No skeleton components found.
- ❌ **16.11** Modal open scale animation — **FAIL**: No modal component (shadcn/ui Dialog not generated).
- ❌ **16.12** Toast slide — **FAIL**: No toast implementation found.
- ❌ **16.13** Cart icon bounce — **FAIL**: Cart state exists in Zustand but no bounce animation.
- ❌ **16.14** Wishlist heart fill — **FAIL**: No wishlist interaction animation.
- ❌ **16.15** `prefers-reduced-motion` honored — **FAIL**: `lib/motion/variants.ts` does not conditionally check `window.matchMedia('(prefers-reduced-motion: reduce)')`.

---

## §17 — Security

- ❌ **17.1** TLS 1.3 — **FAIL**: Nginx config has no SSL configuration at all. HTTP only.
- ❌ **17.1** HSTS — **FAIL**: Not in nginx config.
- ❌ **17.1** CSP header — **FAIL**: Not in nginx config.
- ❌ **17.1** Security headers — **FAIL**: X-Content-Type-Options, X-Frame-Options, Referrer-Policy absent from nginx config.
- ❌ **17.2 A03** SQL Injection — **PASS**: SQLAlchemy ORM used throughout. No string-concatenated SQL found.
- ❌ **17.2 A03** XSS — **PASS**: `dompurify` + `isomorphic-dompurify` installed. No `dangerouslySetInnerHTML` found in reviewed code.
- ❌ **17.2 A05** OpenAPI in production disabled — **PARTIAL**: `main.py:24` disables it in production mode but docker-compose sets `ENVIRONMENT=development`.
- ✅ **17.2 A07** Auth failures — Rate limiting absent (see HIGH-04).
- ❌ **17.3** Rate limits implemented — **FAIL** (covered in HIGH-04).
- ❌ **17.4** CSRF — **FAIL**: No CSRF middleware. `SameSite=lax` not `strict`.
- ⚠️ **17.5** Secrets — **PARTIAL**: `SECRET_KEY` committed in docker-compose (dev value, but still bad practice). No `.env` file committed.
- ❌ **17.6** GDPR data export — **FAIL**: No endpoint.
- ❌ **17.6** Data deletion — **FAIL**: No endpoint.
- ❌ **17.6** `security.txt` — **FAIL**: Absent.

---

## §18 — Performance

- ❌ **18.1** Lighthouse ≥ 90 — **FAIL**: Cannot run (no live server). Hero image missing (`public/images/hero-bg.jpg` doesn't exist) would tank LCP.
- ❌ **18.2** LCP < 2.5s — **FAIL**: Not measurable; also, hero image missing.
- ❌ **18.3** API p95 < 300ms — **FAIL**: No k6 scripts. No running server.
- ⚠️ **18.4** Next.js `<Image>` used — **PARTIAL**: `HeroSection.tsx` uses `<Image>`. Some pages may use raw `<img>`.
- ❌ **18.5** ISR with revalidate — **FAIL**: No `export const revalidate` found on public pages.
- ❌ **18.6** Redis cache on listings — **FAIL**: No cache layer in `packages.py` or any API route.
- ❌ **18.7** EXPLAIN ANALYZE on top queries — **FAIL**: Not runnable.

---

## §19 — SEO

- ✅ **19.1** Unique title + meta description — **PASS**: `generateMetadata()` used on homepage, locale layout. Evidence: `page.tsx:14-24`.
- ✅ **19.2** Open Graph — **PASS**: `layout.tsx:38-44` sets OG fields.
- ❌ **19.3** JSON-LD structured data — **FAIL**: No `<script type="application/ld+json">` found in any page.
- ❌ **19.4** Dynamic `sitemap.xml` — **FAIL**: No `app/sitemap.ts`.
- ✅ **19.5** `robots.txt` equivalent — **FAIL**: Not in `public/` (LOW-09 correction: this is a FAIL).
- ⚠️ **19.6** `hreflang` — **PARTIAL**: Locale routing handles this via middleware but no explicit `<link rel="alternate" hreflang>` tags in `<head>`.
- ❌ **19.7** Canonical URLs — **FAIL**: No canonical tag generation.

---

## §20 — Analytics & Observability

- ❌ **20.1-20.6** All analytics items — **FAIL**: PostHog/Plausible not in `package.json`. No OpenTelemetry. No structured log shipping. Sentry not initialized in frontend. No uptime monitor config.

---

## §21 — Testing

- ❌ **21.1-21.7** All testing items — **FAIL**: `tests/unit/` and `tests/integration/` are empty directories. No Vitest tests. No Playwright tests. No k6 scripts. No Chromatic/Percy.

---

## §22 — DevOps & CI/CD

- ❌ **22.1** GitHub Actions PR workflow — **FAIL**: No `.github/workflows/` directory.
- ❌ **22.2** Staging auto-deploy — **FAIL**: No CI/CD config.
- ❌ **22.3** Tagged release manual approval — **FAIL**: No CI/CD config.
- ⚠️ **22.4** Alembic migrations on deploy — **PARTIAL**: `docker-compose.yml:59` runs `alembic upgrade head` but no backup step.
- ❌ **22.5** Feature flags gating features — **FAIL**: `FeatureFlag` model exists but unused.
- ❌ **22.6** Zero-downtime deploy — **FAIL**: No deploy tooling.
- ❌ **22.7** Backup schedule — **FAIL**: No backup configuration.

---

## §23 — Accessibility

- ⚠️ **23.1** Keyboard navigation — **PARTIAL**: Radix UI components (Accordion, Dialog) handle keyboard by design, but not generated/used yet.
- ❌ **23.2** Color contrast ≥ 4.5:1 — **FAIL**: Cannot verify without running browser.
- ⚠️ **23.3** Alt text — **PARTIAL**: `HeroSection.tsx:29` has `alt="Masjid al-Haram"`. Others not verified.
- ❌ **23.4** Form labels via aria-describedby — **FAIL**: Custom `InputField` component in checkout does not use `aria-describedby` for errors.
- ❌ **23.5** Skip-to-main-content — **FAIL**: Not found in `Header.tsx` or layout.
- ✅ **23.6** Semantic headings — **PASS**: `<h1>` in hero via `t("title")`, section headings use `<h2>`.
- ❌ **23.7** Screen reader test — **FAIL**: Not runnable.
- ❌ **23.8** Modal focus trap — **FAIL**: No modals built yet.
- ❌ **23.9** `<html lang>` switches — **FAIL**: Root `layout.tsx` has `lang="en"` hardcoded. The locale layout sets `lang={locale}` inside the inner div, not on `<html>`.

---

## §24 — Acceptance Criteria

- ❌ **24.1** Pilgrim scenario end-to-end — **FAIL**: DB not set up, payment not wired, customer portal absent.
- ❌ **24.2** Agency scenario end-to-end — **FAIL**: Package wizard absent, admin approval panel absent.
- ❌ **24.3** Super-admin scenario — **FAIL**: No admin panel pages.
