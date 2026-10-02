"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";
import type { TodayAttendance } from "@/lib/types";

type ActionKey = "clock-in" | "break-start" | "break-end" | "clock-out";

const ACTION_PATHS: Record<ActionKey, string> = {
  "clock-in": "/api/attendance/clock-in",
  "break-start": "/api/attendance/break-start",
  "break-end": "/api/attendance/break-end",
  "clock-out": "/api/attendance/clock-out",
};

const SUCCESS_MESSAGES: Record<ActionKey, string> = {
  "clock-in": "Clocked in successfully.",
  "break-start": "Break started.",
  "break-end": "Break ended. Back to work!",
  "clock-out": "Clocked out. Have a great rest of your day!",
};

export function useTodayAttendance() {
  const [data, setData] = useState<TodayAttendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<ActionKey | null>(null);

  const fetchToday = useCallback(async () => {
    try {
      const today = await api.get<TodayAttendance>("/api/attendance/today");
      setData(today);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Could not load today's attendance.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchToday();
  }, [fetchToday]);

  const performAction = useCallback(async (action: ActionKey) => {
    setActionLoading(action);
    try {
      const updated = await api.post<TodayAttendance>(ACTION_PATHS[action]);
      setData(updated);
      toast.success(SUCCESS_MESSAGES[action]);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  }, []);

  return {
    data,
    loading,
    actionLoading,
    clockIn: () => performAction("clock-in"),
    startBreak: () => performAction("break-start"),
    endBreak: () => performAction("break-end"),
    clockOut: () => performAction("clock-out"),
  };
}
