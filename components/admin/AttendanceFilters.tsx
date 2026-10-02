"use client";

import { useState } from "react";
import { LayoutGrid, MoreVertical, Plus, Printer, Search, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { AdminAttendanceFilters } from "./useAdminAttendance";
import type { AttendanceStatus } from "@/lib/types";

const STATUS_OPTIONS: { label: string; value: AttendanceStatus | "" }[] = [
  { label: "All statuses", value: "" },
  { label: "Not Started", value: "NOT_STARTED" },
  { label: "Clock In", value: "CLOCKED_IN" },
  { label: "Break", value: "ON_BREAK" },
  { label: "Clock Out", value: "CLOCKED_OUT" },
];

const notAvailable = (label: string) => toast.info(`${label} isn't available in this demo.`);

export function AttendanceFilters({
  title,
  filters,
  onChange,
}: {
  title: string;
  filters: AdminAttendanceFilters;
  onChange: (partial: Partial<Omit<AdminAttendanceFilters, "page">>) => void;
}) {
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-gray-50 px-4 py-2.5 sm:w-80">
            <Search className="h-4 w-4 shrink-0 text-muted" />
            <input
              type="search"
              placeholder="Search"
              value={filters.search}
              onChange={(e) => onChange({ search: e.target.value })}
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
            />
          </div>
          <button
            type="button"
            onClick={() => notAvailable("Add Attendance")}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            <Plus className="h-4 w-4" />
            Add Attendance
          </button>
          <button
            type="button"
            onClick={() => setFilterPanelOpen((prev) => !prev)}
            aria-expanded={filterPanelOpen}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors",
              filterPanelOpen
                ? "border-primary text-primary-dark"
                : "border-border bg-white text-foreground hover:bg-gray-50",
            )}
          >
            Filter
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          <IconButton label="Export view" onClick={() => notAvailable("Exporting the table view")}>
            <LayoutGrid className="h-4 w-4" />
          </IconButton>
          <IconButton label="Print" onClick={() => notAvailable("Printing")}>
            <Printer className="h-4 w-4" />
          </IconButton>
          <IconButton label="More options" onClick={() => notAvailable("More options")}>
            <MoreVertical className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      {filterPanelOpen && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-gray-50 p-3">
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
          {(filters.date || filters.status) && (
            <button
              type="button"
              onClick={() => onChange({ date: "", status: "" })}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-foreground transition-colors hover:bg-gray-50"
    >
      {children}
    </button>
  );
}
