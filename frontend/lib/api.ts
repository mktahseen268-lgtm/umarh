import axios from "axios";

const API_BASE = process.env["NEXT_PUBLIC_API_URL"] ?? "/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isLoginEndpoint = original.url?.includes("/login") || original.url?.includes("/auth/refresh");
    if (error.response?.status === 401 && !original._retry && !isLoginEndpoint) {
      original._retry = true;
      try {
        await apiClient.post("/auth/refresh");
        return apiClient(original);
      } catch {
        if (typeof window !== "undefined") {
          const path   = window.location.pathname;
          const locale = path.split("/")[1] ?? "en";
          const isAdmin = path.includes("/admin");
          window.location.href = isAdmin
            ? `/${locale}/admin/login`
            : `/${locale}/sign-in`;
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────
export const auth = {
  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }),
  register: (data: RegisterPayload) =>
    apiClient.post("/auth/register", data),
  logout: () => apiClient.post("/auth/logout"),
  refresh: () => apiClient.post("/auth/refresh"),
  me: () => apiClient.get("/auth/me"),
  forgotPassword: (email: string) =>
    apiClient.post("/auth/forgot-password", { email }),
  resetPassword: (token: string, password: string) =>
    apiClient.post("/auth/reset-password", { token, password }),
  verifyOtp: (phone: string, code: string) =>
    apiClient.post("/auth/verify-otp", { phone, code }),
};

// ─── Packages ──────────────────────────────────────────────────────────────
export const packages = {
  list: (params: PackageQueryParams) =>
    apiClient.get<PaginatedResponse<Package>>("/packages", { params }),
  get: (idOrSlug: string) =>
    apiClient.get<Package>(`/packages/${idOrSlug}`),
  featured: () => apiClient.get<Package[]>("/packages/featured"),
  related: (id: string) => apiClient.get<Package[]>(`/packages/${id}/related`),
  // Agency
  create: (data: CreatePackagePayload) => apiClient.post("/packages", data),
  update: (id: string, data: Partial<CreatePackagePayload>) =>
    apiClient.patch(`/packages/${id}`, data),
  delete: (id: string) => apiClient.delete(`/packages/${id}`),
  submit: (id: string) => apiClient.post(`/packages/${id}/submit`),
};

// ─── Destinations ──────────────────────────────────────────────────────────
export const destinations = {
  list: () => apiClient.get<Destination[]>("/destinations"),
  get: (slug: string) => apiClient.get<Destination>(`/destinations/${slug}`),
  featured: () => apiClient.get<Destination[]>("/destinations/featured"),
};

// ─── Bookings ──────────────────────────────────────────────────────────────
export const bookings = {
  create: (data: CreateBookingPayload) =>
    apiClient.post<Booking>("/bookings", data),
  list: (params?: { status?: string; page?: number }) =>
    apiClient.get<PaginatedResponse<Booking>>("/bookings", { params }),
  get: (id: string) => apiClient.get<Booking>(`/bookings/${id}`),
  cancel: (id: string, reason: string) =>
    apiClient.post(`/bookings/${id}/cancel`, { reason }),
};

// ─── Reviews ───────────────────────────────────────────────────────────────
export const reviews = {
  list: (packageId: string, params?: { page?: number }) =>
    apiClient.get<PaginatedResponse<Review>>(`/packages/${packageId}/reviews`, { params }),
  create: (bookingId: string, data: CreateReviewPayload) =>
    apiClient.post("/reviews", { booking_id: bookingId, ...data }),
};

// ─── Agencies ──────────────────────────────────────────────────────────────
export const agencies = {
  list: (params?: { page?: number }) =>
    apiClient.get<PaginatedResponse<Agency>>("/agencies", { params }),
  get: (slug: string) => apiClient.get<Agency>(`/agencies/${slug}`),
  dashboard: () => apiClient.get("/agencies/me/dashboard"),
};

// ─── FAQs ──────────────────────────────────────────────────────────────────
export const faqs = {
  list: (category?: string) =>
    apiClient.get<FAQ[]>("/faqs", { params: { category } }),
};

// ─── Wishlist ──────────────────────────────────────────────────────────────
export const wishlist = {
  list: () => apiClient.get("/wishlist"),
  add: (packageId: string) => apiClient.post("/wishlist", { package_id: packageId }),
  remove: (packageId: string) => apiClient.delete(`/wishlist/${packageId}`),
};

// ─── Admin ─────────────────────────────────────────────────────────────────
export const adminApi = {
  stats: () => apiClient.get<AdminStats>("/admin/stats"),
  agencies: (params?: { page?: number; per_page?: number; status?: string; q?: string }) =>
    apiClient.get<AdminListResponse<AdminAgency>>("/admin/agencies", { params }),
  updateAgencyStatus: (id: string, status: string) =>
    apiClient.patch(`/admin/agencies/${id}`, { status }),
  bookings: (params?: { page?: number; per_page?: number; status?: string; q?: string }) =>
    apiClient.get<AdminListResponse<AdminBooking>>("/admin/bookings", { params }),
  users: (params?: { page?: number; per_page?: number; q?: string }) =>
    apiClient.get<AdminListResponse<AdminUser>>("/admin/users", { params }),
  updateUserStatus: (id: string, status: string) =>
    apiClient.patch(`/admin/users/${id}`, { status }),
  packages: (params?: { page?: number; per_page?: number; status?: string; category?: string; q?: string }) =>
    apiClient.get<AdminListResponse<AdminPackage>>("/admin/packages", { params }),
  getPackage: (id: string) =>
    apiClient.get<AdminPackageDetail>(`/admin/packages/${id}`),
  createPackage: (data: AdminCreatePackagePayload) =>
    apiClient.post<AdminPackage>("/admin/packages", data),
  updatePackage: (id: string, data: AdminCreatePackagePayload) =>
    apiClient.put<AdminPackage>(`/admin/packages/${id}`, data),
  updatePackageStatus: (id: string, status: string) =>
    apiClient.patch(`/admin/packages/${id}`, { status }),
};

// ─── Types ─────────────────────────────────────────────────────────────────
export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  country_code: string;
}

export interface PackageQueryParams {
  page?: number;
  per_page?: number;
  tour_type?: string;
  price_min?: number;
  price_max?: number;
  duration?: string;
  language?: string;
  rating?: number;
  agency_id?: string;
  special?: string;
  sort?: string;
  q?: string;
  date_from?: string;
  date_to?: string;
}

export interface Package {
  id: string;
  slug: string;
  title: Record<string, string>;
  summary: Record<string, string>;
  description: Record<string, string>;
  category: string;
  duration_days: number;
  duration_nights: number;
  base_price: number;
  discounted_price?: number;
  currency: string;
  images: Array<{ url: string; type: string }>;
  rating: number;
  review_count: number;
  destination: { name: Record<string, string>; city: string };
  agency: { id: string; slug: string; trade_name: string; logo_url: string };
  status: string;
  includes_visa: boolean;
  includes_flights: boolean;
  meal_plan: string;
  language_spoken: string[];
  guide?: { name: string; languages: string[]; whatsapp?: string };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface Destination {
  id: string;
  slug: string;
  name: Record<string, string>;
  country: string;
  city: string;
  cover_image_url: string;
  description: Record<string, string>;
  featured: boolean;
}

export interface Booking {
  id: string;
  booking_ref: string;
  status: string;
  total_amount: number;
  service_fee: number;
  tax_amount: number;
  currency: string;
  start_date: string;
  end_date: string;
  num_adults: number;
  num_youth: number;
  num_children: number;
  package: Package;
  created_at: string;
}

export interface CreateBookingPayload {
  package_id: string;
  start_date: string;
  end_date: string;
  num_adults: number;
  num_youth: number;
  num_children: number;
  special_requests?: string;
  travelers: Array<{
    first_name: string;
    last_name: string;
    dob: string;
    gender: string;
    passport_number: string;
    passport_expiry: string;
    nationality: string;
  }>;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  customer: { first_name: string; last_name: string; avatar_url?: string };
  created_at: string;
}

export interface CreateReviewPayload {
  rating: number;
  title: string;
  body: string;
}

export interface Agency {
  id: string;
  slug: string;
  trade_name: string;
  logo_url: string;
  description?: string;
  package_count: number;
  rating: number;
  status: string;
}

export interface FAQ {
  id: string;
  category: string;
  question: Record<string, string>;
  answer: Record<string, string>;
}

export interface CreatePackagePayload {
  title: Record<string, string>;
  summary: Record<string, string>;
  description: Record<string, string>;
  category: string;
  duration_days: number;
  base_price: number;
  currency: string;
}

export interface AdminStats {
  total_users: number;
  total_agencies: number;
  total_bookings: number;
  pending_agencies: number;
  confirmed_bookings: number;
  revenue_total: number;
}

export interface AdminAgency {
  id: string;
  slug: string;
  trade_name: string;
  legal_name: string;
  email: string;
  country: string;
  status: string;
  commission_rate: number;
  created_at: string;
}

export interface AdminBooking {
  id: string;
  booking_ref: string;
  status: string;
  total_amount: number;
  currency: string;
  num_adults: number;
  start_date: string | null;
  customer_name: string;
  customer_email: string;
  agency_name: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  preferred_language: string;
  created_at: string;
  roles: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  preferred_language: string;
  roles: string[];
}

export interface AdminPackage {
  id: string;
  slug: string;
  title: Record<string, string>;
  category: string;
  duration_days: number;
  base_price: number;
  currency: string;
  status: string;
  agency_name: string;
  agency_id: string;
  created_at: string;
}

export interface HotelEntryPayload {
  hotel_name: string;
  hotel_name_ar?: string;
  city: string;
  star_rating: number;
  distance_from_haram_m?: number | null;
  room_type: string;
  board_basis: string;
  check_in_day?: number | null;
  nights?: number | null;
  hotel_images?: string[];
}

export interface ItineraryDayPayload {
  day_number: number;
  title_en: string;
  title_ar?: string;
  description_en?: string;
  description_ar?: string;
  activities?: string[];
  location?: string;
}

export interface AdminCreatePackagePayload {
  // Identity
  agency_id: string;
  title_en: string;
  title_ar?: string;
  slug?: string;
  // Descriptions
  summary_en?: string;
  summary_ar?: string;
  description_en?: string;
  description_ar?: string;
  // Classification
  category: string;
  package_type?: string;
  status?: string;
  seasonal_tag?: string;
  // Duration & dates
  duration_days: number;
  duration_nights?: number;
  start_date?: string | null;
  end_date?: string | null;
  flexible_dates?: boolean;
  makkah_nights?: number | null;
  madinah_nights?: number | null;
  // Pricing
  base_price: number;
  currency?: string;
  price_per_adult?: number | null;
  price_per_child?: number | null;
  price_per_infant?: number | null;
  discount_type?: string | null;
  discount_value?: number | null;
  installment_option?: boolean;
  // Transport
  airline_name?: string;
  flight_type?: string;
  flight_class?: string;
  departure_city?: string;
  airport_transfers?: boolean;
  intercity_transport?: string;
  includes_flights?: boolean;
  // Services
  includes_visa?: boolean;
  meal_plan?: string;
  ziyarat_included?: boolean;
  laundry_service?: boolean;
  wheelchair_assistance?: boolean;
  ihram_provided?: boolean;
  language_spoken?: string[];
  guide_languages?: string[];
  services_included?: string[];
  services_excluded?: string[];
  // Capacity
  min_group_size?: number;
  max_group_size?: number | null;
  max_persons?: number | null;
  available_slots?: number | null;
  booking_deadline?: string | null;
  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  og_image_url?: string;
  // Media
  image_urls?: string[];
  video_url?: string;
  // Nested
  hotels?: HotelEntryPayload[];
  itinerary?: ItineraryDayPayload[];
}

export interface AdminPackageDetail extends AdminCreatePackagePayload {
  id: string;
  slug: string;
  status: string;
  agency_name: string;
  discounted_price?: number | null;
  created_at?: string;
}

export interface AdminListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
