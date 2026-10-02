"use client";

import { Button } from "@/components/ui/Button";
import type { TodayAttendance } from "@/lib/types";

interface ActionButtonsProps {
  attendance: TodayAttendance;
  actionLoading: string | null;
  onClockIn: () => void;
  onStartBreak: () => void;
  onEndBreak: () => void;
  onClockOut: () => void;
}

export function ActionButtons({
  attendance,
  actionLoading,
  onClockIn,
  onStartBreak,
  onEndBreak,
  onClockOut,
}: ActionButtonsProps) {
  const busy = actionLoading !== null;
  const status = attendance.status;

  const canClockIn = status === "NOT_STARTED";
  const canStartBreak = status === "CLOCKED_IN";
  const canEndBreak = status === "ON_BREAK";
  const canClockOut = status === "CLOCKED_IN";
  const isOnBreak = status === "ON_BREAK";

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full gap-3">
        <Button
          variant="warning"
          size="md"
          className="min-w-0 flex-1 whitespace-nowrap"
          loading={actionLoading === "clock-out"}
          disabled={busy || !canClockOut}
          onClick={onClockOut}
        >
          Clock Out
        </Button>
        <Button
          variant="success"
          size="md"
          className="min-w-0 flex-1 whitespace-nowrap"
          loading={actionLoading === "break-start" || actionLoading === "break-end"}
          disabled={busy || (!canStartBreak && !canEndBreak)}
          onClick={isOnBreak ? onEndBreak : onStartBreak}
        >
          {isOnBreak ? "End Break" : "Start Break"}
        </Button>
        <Button
          variant="primary"
          size="md"
          className="min-w-0 flex-1 whitespace-nowrap"
          loading={actionLoading === "clock-in"}
          disabled={busy || !canClockIn}
          onClick={onClockIn}
        >
          Clock In
        </Button>
      </div>

      {status === "CLOCKED_OUT" && (
        <p className="text-center text-sm font-medium text-success-dark">Attendance completed for today</p>
      )}
    </div>
  );
}
