"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, formatWeekRangeLabel } from "@/lib/utils";
import { useWeeklyAttendance } from "./useWeeklyAttendance";
import { DayTimelineRow } from "./DayTimelineRow";
import { WeekTable } from "./WeekTable";
import { AXIS_HOURS } from "./timelineAxis";

const DAY_ABBREVS = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

export function WeeklyTimeline({ refreshToken }: { refreshToken?: string }) {
  const { weekDates, daysByDate, loading, goPrevWeek, goNextWeek } = useWeeklyAttendance(refreshToken);
  const [view, setView] = useState<"list" | "table">("list");

  const today = new Date();
  const todayKey = today.toDateString();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-foreground">Attendance Summary</h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrevWeek}
            aria-label="Previous week"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-primary">
            {formatWeekRangeLabel(weekDates[0], weekDates[6])}
          </span>
          <button
            type="button"
            onClick={goNextWeek}
            aria-label="Next week"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex rounded-xl border border-border p-1 text-sm font-medium">
          <button
            type="button"
            onClick={() => setView("list")}
            className={cn("rounded-lg px-3 py-1.5 transition-colors", view === "list" ? "bg-primary-light text-primary-dark" : "text-muted")}
          >
            List View
          </button>
          <button
            type="button"
            onClick={() => setView("table")}
            className={cn("rounded-lg px-3 py-1.5 transition-colors", view === "table" ? "bg-primary-light text-primary-dark" : "text-muted")}
          >
            Table view
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[220px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : view === "table" ? (
        <WeekTable weekDates={weekDates} daysByDate={daysByDate} dayAbbrevs={DAY_ABBREVS} />
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[640px] overflow-hidden rounded-xl border border-border">
            <div className="flex items-stretch gap-4 bg-sidebar-tint px-4 py-3">
              <div className="flex w-16 shrink-0 items-center border-r border-border pr-3 sm:w-24">
                <span className="text-xs font-semibold text-foreground">Day</span>
              </div>
              <div className="relative flex h-5 flex-1">
                {AXIS_HOURS.map(({ hour, label }) => (
                  <div
                    key={hour}
                    className="absolute top-0 flex h-full items-center"
                    style={{ left: `calc(1.5rem + ${((hour - AXIS_HOURS[0].hour) / (AXIS_HOURS.length - 1)) * 100}%)` }}
                  >
                    {label ? (
                      <span className="-translate-x-1/2 text-xs font-medium text-muted">{label}</span>
                    ) : (
                      <span className="text-gray-300">|</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {weekDates.map((date) => {
              const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              return (
                <DayTimelineRow
                  key={dateKey}
                  dayAbbrev={DAY_ABBREVS[date.getDay()]}
                  dateLabel={date.toLocaleDateString("en-US", { day: "2-digit", month: "short" })}
                  isWeekend={isWeekend}
                  day={daysByDate[dateKey]}
                  highlight={date.toDateString() === todayKey}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
