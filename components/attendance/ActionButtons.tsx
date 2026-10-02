"use client";

import { CalendarCheck2, UserCog } from "lucide-react";
import { toast } from "sonner";
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

  const notify = (label: string) => toast.info(`${label} isn't available in this demo.`);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full gap-3">
        <Button
          variant="warning"
          size="lg"
          className="flex-1 whitespace-nowrap px-2 text-sm"
          loading={actionLoading === "clock-out"}
          disabled={busy || !canClockOut}
          onClick={onClockOut}
        >
          Clock Out
        </Button>
        <Button
          variant="success"
          size="lg"
          className="flex-1 whitespace-nowrap px-2 text-sm"
          loading={actionLoading === "break-start" || actionLoading === "break-end"}
          disabled={busy || (!canStartBreak && !canEndBreak)}
          onClick={isOnBreak ? onEndBreak : onStartBreak}
        >
          {isOnBreak ? "End Break" : "Start Break"}
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1 whitespace-nowrap px-2 text-sm"
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

      <div className="flex w-full gap-3 border-t border-border pt-4">
        <Button variant="outline" size="md" className="flex-1" onClick={() => notify("Request Attendance")}>
          <CalendarCheck2 className="h-4 w-4" />
          Request Attendance
        </Button>
        <Button variant="outline" size="md" className="flex-1" onClick={() => notify("Request Overtime")}>
          <UserCog className="h-4 w-4" />
          Request Overtime
        </Button>
      </div>
    </div>
  );
}
