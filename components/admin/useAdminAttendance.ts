"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";
import type { AdminAttendanceResponse, AttendanceStatus } from "@/lib/types";

export interface AdminAttendanceFilters {
  search: string;
  date: string;
  status: AttendanceStatus | "";
  page: number;
  limit: number;
}

const DEFAULT_LIMIT = 10;

export function useAdminAttendance() {
  const [filters, setFilters] = useState<AdminAttendanceFilters>({
    search: "",
    date: "",
    status: "",
    page: 1,
    limit: DEFAULT_LIMIT,
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [response, setResponse] = useState<AdminAttendanceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(filters.search), 350);
    return () => clearTimeout(handle);
  }, [filters.search]);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    const params = new URLSearchParams();
    params.set("page", String(filters.page));
    params.set("limit", String(filters.limit));
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.date) params.set("date", filters.date);
    if (filters.status) params.set("status", filters.status);

    api
      .get<AdminAttendanceResponse>(`/api/admin/attendance?${params.toString()}`)
      .then((data) => {
        if (!cancelled) setResponse(data);
      })
      .catch((error) => {
        if (!cancelled) {
          const message = error instanceof ApiError ? error.message : "Could not load attendance records.";
          toast.error(message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, filters.date, filters.status, filters.page, filters.limit]);

  const updateFilters = (partial: Partial<Omit<AdminAttendanceFilters, "page">>) => {
    setFilters((prev) => ({ ...prev, ...partial, page: 1 }));
  };

  const setPage = (page: number) => setFilters((prev) => ({ ...prev, page }));
  const setLimit = (limit: number) => setFilters((prev) => ({ ...prev, limit, page: 1 }));

  return {
    filters,
    updateFilters,
    setPage,
    setLimit,
    records: response?.records ?? [],
    pagination: response?.pagination,
    loading,
  };
}
