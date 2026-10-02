"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";
import { addDays, getDateKeyLocal, getWeekStart } from "@/lib/utils";
import type { AttendanceDay, AttendanceHistoryResponse } from "@/lib/types";

export function useWeeklyAttendance(refreshToken?: string) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [daysByDate, setDaysByDate] = useState<Record<string, AttendanceDay>>({});
  const [loading, setLoading] = useState(true);

  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const fromKey = getDateKeyLocal(weekDates[0]);
  const toKey = getDateKeyLocal(weekDates[6]);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    api
      .get<AttendanceHistoryResponse>(`/api/attendance/history?from=${fromKey}&to=${toKey}`)
      .then((res) => {
        if (cancelled) return;
        const map: Record<string, AttendanceDay> = {};
        for (const day of res.days) map[day.attendanceDate] = day;
        setDaysByDate(map);
      })
      .catch((error) => {
        if (cancelled) return;
        const message = error instanceof ApiError ? error.message : "Could not load attendance history.";
        toast.error(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // refreshToken (today's serverTime from the live clock-in widget) deliberately re-triggers
    // this fetch after every clock-in/break/clock-out action, so "today" never shows stale data.
  }, [fromKey, toKey, refreshToken]);

  return {
    weekDates,
    daysByDate,
    loading,
    goPrevWeek: () => setWeekStart((prev) => addDays(prev, -7)),
    goNextWeek: () => setWeekStart((prev) => addDays(prev, 7)),
    goToday: () => setWeekStart(getWeekStart(new Date())),
  };
}
