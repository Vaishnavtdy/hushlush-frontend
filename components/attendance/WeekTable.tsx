import { StatusBadge } from "@/components/ui/Badge";
import { formatClockTime, formatDuration, getDateKeyLocal } from "@/lib/utils";
import type { AttendanceDay } from "@/lib/types";

export function WeekTable({
  weekDates,
  daysByDate,
  dayAbbrevs,
}: {
  weekDates: Date[];
  daysByDate: Record<string, AttendanceDay>;
  dayAbbrevs: string[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted">
            <th className="px-3 py-2">Day</th>
            <th className="px-3 py-2">Clock In</th>
            <th className="px-3 py-2">Clock Out</th>
            <th className="px-3 py-2">Break</th>
            <th className="px-3 py-2">Working Hours</th>
            <th className="px-3 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {weekDates.map((date) => {
            const dateKey = getDateKeyLocal(date);
            const day = daysByDate[dateKey];
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;

            return (
              <tr key={dateKey} className="border-b border-border last:border-0 hover:bg-gray-50">
                <td className="px-3 py-3">
                  <p className="font-medium text-foreground">{dayAbbrevs[date.getDay()]}</p>
                  <p className="text-xs text-muted">{date.toLocaleDateString("en-US", { day: "2-digit", month: "short" })}</p>
                </td>
                {isWeekend ? (
                  <td className="px-3 py-3 text-muted" colSpan={5}>
                    Weekend
                  </td>
                ) : !day ? (
                  <td className="px-3 py-3 text-muted" colSpan={5}>
                    No activity
                  </td>
                ) : (
                  <>
                    <td className="px-3 py-3 font-mono text-foreground">{formatClockTime(day.clockIn)}</td>
                    <td className="px-3 py-3 font-mono text-foreground">{formatClockTime(day.clockOut)}</td>
                    <td className="px-3 py-3 font-mono text-foreground">{formatDuration(day.totalBreakSeconds)}</td>
                    <td className="px-3 py-3 font-mono text-foreground">{formatDuration(day.totalWorkSeconds)}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={day.status} />
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
