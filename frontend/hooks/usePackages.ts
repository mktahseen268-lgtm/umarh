import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { packages as pkgApi, type PackageQueryParams } from "@/lib/api";

export const PACKAGES_KEY = "packages";

export function usePackages(params: PackageQueryParams = {}) {
  return useQuery({
    queryKey: [PACKAGES_KEY, params],
    queryFn:  () => pkgApi.list(params).then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useFeaturedPackages() {
  return useQuery({
    queryKey: [PACKAGES_KEY, "featured"],
    queryFn:  () => pkgApi.featured().then((r) => r.data),
    staleTime: 120_000,
  });
}

export function usePackage(slug: string) {
  return useQuery({
    queryKey: [PACKAGES_KEY, slug],
    queryFn:  () => pkgApi.get(slug).then((r) => r.data),
    enabled:  !!slug,
    staleTime: 60_000,
  });
}

export function useRelatedPackages(id: string) {
  return useQuery({
    queryKey: [PACKAGES_KEY, id, "related"],
    queryFn:  () => pkgApi.related(id).then((r) => r.data),
    enabled:  !!id,
    staleTime: 120_000,
  });
}
