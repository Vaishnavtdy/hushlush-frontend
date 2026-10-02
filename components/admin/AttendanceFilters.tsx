"use client";

import { Search } from "lucide-react";
import type { AdminAttendanceFilters } from "./useAdminAttendance";
import type { AttendanceStatus } from "@/lib/types";

const STATUS_OPTIONS: { label: string; value: AttendanceStatus | "" }[] = [
  { label: "All statuses", value: "" },
  { label: "Not Started", value: "NOT_STARTED" },
  { label: "Clocked In", value: "CLOCKED_IN" },
  { label: "On Break", value: "ON_BREAK" },
  { label: "Clocked Out", value: "CLOCKED_OUT" },
];

export function AttendanceFilters({
  filters,
  onChange,
}: {
  filters: AdminAttendanceFilters;
  onChange: (partial: Partial<Omit<AdminAttendanceFilters, "page">>) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-gray-50 px-4 py-2.5 sm:w-80">
        <Search className="h-4 w-4 text-muted" />
        <input
          type="search"
          placeholder="Search by name, email, or employee ID"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="date"
          value={filters.date}
          onChange={(e) => onChange({ date: e.target.value })}
          className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          aria-label="Filter by date"
        />
        <select
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value as AttendanceStatus | "" })}
          className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
