import { cn, formatClockTime, formatDuration } from "@/lib/utils";
import { timeToPercent } from "./timelineAxis";
import type { AttendanceDay } from "@/lib/types";

interface DayTimelineRowProps {
  dayAbbrev: string;
  dateLabel: string;
  isWeekend: boolean;
  day?: AttendanceDay;
  highlight?: boolean;
}

export function DayTimelineRow({ dayAbbrev, dateLabel, isWeekend, day, highlight }: DayTimelineRowProps) {
  const hasActivity = Boolean(day?.clockIn);

  return (
    <div className={cn("flex items-center gap-4 border-b border-border px-4 py-4 last:border-0", highlight && "bg-primary-light/30")}>
      <div className="w-16 shrink-0 border-r border-border pr-3 sm:w-24">
        <p className="text-sm font-semibold text-foreground">{dayAbbrev}</p>
        <p className="text-xs font-medium text-primary">{dateLabel}</p>
      </div>

      <div className="relative h-8 flex-1">
        {isWeekend ? (
          <>
            <div className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-info" />
              <span className="h-1.5 w-1.5 rounded-full bg-info/60" />
            </div>
            <div className="absolute inset-y-1/2 left-6 right-0 h-1 -translate-y-1/2 rounded-full bg-info/15" />
            <span className="absolute left-10 top-1/2 -translate-y-1/2 rounded-md border border-info/40 bg-white px-2 py-0.5 text-xs font-medium text-info">
              Weekend
            </span>
          </>
        ) : !hasActivity ? (
          <>
            <span className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-gray-300 bg-white" />
            <div className="absolute inset-y-1/2 left-6 right-0 h-1 -translate-y-1/2 rounded-full bg-gray-100" />
          </>
        ) : (
          <ActiveDayTrack day={day!} />
        )}
      </div>
    </div>
  );
}

function ActiveDayTrack({ day }: { day: AttendanceDay }) {
  const clockInDate = new Date(day.clockIn!);
  const endDate = day.clockOut ? new Date(day.clockOut) : new Date(day.serverTime);
  const isOngoing = !day.clockOut;

  const startPct = timeToPercent(clockInDate);
  const endPct = Math.max(startPct, timeToPercent(endDate));

  return (
    <>
      <div className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-1">
        <span className="h-2.5 w-2.5 rounded-full border-2 border-gray-300 bg-white" />
        <span className={cn("h-1.5 w-1.5 rounded-full", isOngoing ? "bg-warning" : "bg-primary")} />
      </div>

      {/* base track */}
      <div className="absolute inset-y-1/2 left-6 right-0 h-1 -translate-y-1/2 rounded-full bg-gray-100" />

      {/* elapsed (working + break) segment */}
      <div
        className={cn("absolute top-1/2 h-1 -translate-y-1/2 rounded-full", isOngoing ? "bg-warning" : "bg-primary")}
        style={{ left: `calc(1.5rem + ${startPct}%)`, width: `${Math.max(0.5, endPct - startPct)}%` }}
      />

      {/* break insets, cut into the elapsed segment */}
      {day.breaks.map((brk, index) => {
        const breakStart = timeToPercent(new Date(brk.startedAt));
        const breakEnd = brk.endedAt ? timeToPercent(new Date(brk.endedAt)) : timeToPercent(new Date(day.serverTime));
        return (
          <div
            key={index}
            className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-success"
            style={{ left: `calc(1.5rem + ${breakStart}%)`, width: `${Math.max(0.5, breakEnd - breakStart)}%` }}
          />
        );
      })}

      {/* clock-in time badge */}
      <span
        className="absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-md border border-primary/40 bg-white px-1.5 py-0.5 text-[11px] font-medium text-primary-dark shadow-sm"
        style={{ left: `calc(1.5rem + ${startPct}%)` }}
      >
        {formatClockTime(day.clockIn)}
      </span>

      {/* break duration badges */}
      {day.breaks.map((brk, index) => {
        const breakStart = timeToPercent(new Date(brk.startedAt));
        if (brk.durationSeconds === null) return null;
        const alternate = index % 2 === 1;
        return (
          <span
            key={index}
            className={cn(
              "absolute bottom-0 -translate-x-1/2 whitespace-nowrap rounded-md border bg-white px-1.5 py-0.5 text-[11px] font-medium shadow-sm",
              alternate ? "border-info/40 text-info" : "border-success/40 text-success-dark",
            )}
            style={{ left: `calc(1.5rem + ${breakStart}%)` }}
          >
            {formatDuration(brk.durationSeconds)}
          </span>
        );
      })}

      {/* end dot */}
      <span
        className={cn(
          "absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full",
          isOngoing ? "bg-warning" : "bg-primary",
        )}
        style={{ left: `calc(1.5rem + ${endPct}%)` }}
      />
    </>
  );
}
