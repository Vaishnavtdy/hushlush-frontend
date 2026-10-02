import { cn } from "@/lib/utils";
import type { AttendanceStatus } from "@/lib/types";

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; dot: string; classes: string }> = {
  NOT_STARTED: {
    label: "Not Started",
    dot: "bg-gray-400",
    classes: "bg-gray-100 text-gray-600",
  },
  CLOCKED_IN: {
    label: "Clock In",
    dot: "bg-primary",
    classes: "bg-primary-light text-primary-dark",
  },
  ON_BREAK: {
    label: "Break",
    dot: "bg-success",
    classes: "bg-success-light text-success-dark",
  },
  CLOCKED_OUT: {
    label: "Clock Out",
    dot: "bg-warning",
    classes: "bg-warning-light text-warning-dark",
  },
};

export function StatusBadge({ status }: { status: AttendanceStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        config.classes,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
