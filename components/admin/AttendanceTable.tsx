"use client";

import { ArrowUpDown, Bell, Clock, FileText, Users } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/ui/Badge";
import { cn, formatClockTime, formatDateLabel, formatDuration } from "@/lib/utils";
import type { AdminAttendanceRecord } from "@/lib/types";
import type { AttendanceView } from "./AttendanceViewControls";

const STANDARD_SHIFT_SECONDS = 8 * 60 * 60;

function formatOvertime(totalWorkSeconds: number): string {
  const overtime = totalWorkSeconds - STANDARD_SHIFT_SECONDS;
  return overtime > 0 ? `+ ${formatDuration(overtime)}` : "-";
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const notAvailable = (label: string) => toast.info(`${label} isn't available in this demo.`);

const SORTABLE_HEADERS = [
  "Employee Name",
  "Date",
  "First In",
  "Last Out",
  "Total Break",
  "Overtime Hrs",
  "Total Hrs",
  "Status",
];

export function AttendanceTable({
  records,
  loading,
  view = "table",
}: {
  records: AdminAttendanceRecord[];
  loading: boolean;
  view?: AttendanceView;
}) {
  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-1 text-center text-sm text-muted">
        <p className="font-medium text-foreground">No attendance records found</p>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
  }

  const showAvatarColumn = view === "list";
  const showActionColumn = view === "list";

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            {showAvatarColumn && <th className="px-4 py-4 font-semibold text-foreground">Avatar</th>}
            {SORTABLE_HEADERS.map((label) => (
              <SortableHeader key={label} label={label} />
            ))}
            {showActionColumn && <th className="px-4 py-4 font-semibold text-foreground">Action</th>}
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-b border-border last:border-0 hover:bg-gray-50">
              {showAvatarColumn && (
                <td className="px-4 py-3.5">
                  {record.user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element -- small avatar thumbnail, no next/image optimization needed
                    <img src={record.user.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary-dark">
                      {initialsOf(record.user.name)}
                    </div>
                  )}
                </td>
              )}
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  {!showAvatarColumn && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary-dark">
                      {initialsOf(record.user.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{record.user.name}</p>
                    <p className="truncate text-xs text-muted">{record.user.employeeId}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5 text-foreground">{formatDateLabel(record.attendanceDate)}</td>
              <td className="px-4 py-3.5 font-mono text-foreground">{formatClockTime(record.clockIn)}</td>
              <td className="px-4 py-3.5 font-mono text-foreground">{formatClockTime(record.clockOut)}</td>
              <td className="px-4 py-3.5 font-mono text-foreground">{formatDuration(record.totalBreakSeconds)}</td>
              <td className="px-4 py-3.5 font-mono text-foreground">{formatOvertime(record.totalWorkSeconds)}</td>
              <td className="px-4 py-3.5 font-mono text-foreground">{formatDuration(record.totalWorkSeconds)}</td>
              <td className="px-4 py-3.5">
                <StatusBadge status={record.status} />
              </td>
              {showActionColumn && (
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <ActionIcon
                      label="View history"
                      onClick={() => notAvailable("Viewing attendance history")}
                      className="border-primary/30 text-primary"
                    >
                      <Clock className="h-3.5 w-3.5" />
                    </ActionIcon>
                    <ActionIcon
                      label="View timesheet"
                      onClick={() => notAvailable("Viewing the timesheet")}
                      className="border-warning/40 text-warning-dark"
                    >
                      <FileText className="h-3.5 w-3.5" />
                    </ActionIcon>
                    <ActionIcon
                      label="Assign team"
                      onClick={() => notAvailable("Assigning a team")}
                      className="border-info/40 text-info"
                    >
                      <Users className="h-3.5 w-3.5" />
                    </ActionIcon>
                    <button
                      type="button"
                      onClick={() => notAvailable("Sending a notice")}
                      aria-label="Notify"
                      title="Notify"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark"
                    >
                      <Bell className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SortableHeader({ label }: { label: string }) {
  return (
    <th className="px-4 py-4 font-semibold text-foreground">
      <button
        type="button"
        onClick={() => notAvailable("Sorting")}
        className="flex items-center gap-1.5 hover:text-primary-dark"
      >
        {label}
        <ArrowUpDown className="h-3 w-3 text-muted" />
      </button>
    </th>
  );
}

function ActionIcon({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn("flex h-7 w-7 items-center justify-center rounded-full border bg-white hover:bg-gray-50", className)}
    >
      {children}
    </button>
  );
}
