import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookings as bookingApi, type CreateBookingPayload } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export function useMyBookings(status?: string) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn());
  return useQuery({
    queryKey: ["bookings", status],
    queryFn:  () => bookingApi.list({ status }).then((r) => r.data),
    enabled:  isLoggedIn,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookingPayload) => bookingApi.create(data).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["bookings"] }); },
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      bookingApi.cancel(id, reason).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["bookings"] }); },
  });
}
