import { StatusBadge } from "@/components/ui/Badge";
import { formatClockTime, formatDateLabel, formatDuration } from "@/lib/utils";
import type { AdminAttendanceRecord } from "@/lib/types";

export function AttendanceTable({ records, loading }: { records: AdminAttendanceRecord[]; loading: boolean }) {
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[840px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted">
            <th className="px-4 py-3">Employee</th>
            <th className="px-4 py-3">Employee ID</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Clock In</th>
            <th className="px-4 py-3">Clock Out</th>
            <th className="px-4 py-3">Break Duration</th>
            <th className="px-4 py-3">Working Hours</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id} className="border-b border-border last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary-dark">
                    {record.user.name
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{record.user.name}</p>
                    <p className="truncate text-xs text-muted">{record.user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-foreground">{record.user.employeeId}</td>
              <td className="px-4 py-3 text-foreground">{formatDateLabel(record.attendanceDate)}</td>
              <td className="px-4 py-3 font-mono text-foreground">{formatClockTime(record.clockIn)}</td>
              <td className="px-4 py-3 font-mono text-foreground">{formatClockTime(record.clockOut)}</td>
              <td className="px-4 py-3 font-mono text-foreground">{formatDuration(record.totalBreakSeconds)}</td>
              <td className="px-4 py-3 font-mono text-foreground">{formatDuration(record.totalWorkSeconds)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={record.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
