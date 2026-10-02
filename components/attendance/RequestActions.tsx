"use client";

import { ClipboardCheck, UserCog } from "lucide-react";
import { toast } from "sonner";

export function RequestActions() {
  const notify = (label: string) => toast.info(`${label} isn't available in this demo.`);

  return (
    <div className="flex w-full gap-4">
      <button
        type="button"
        onClick={() => notify("Request Attendance")}
        className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-border bg-white px-3 py-4 text-xs font-bold text-primary-dark transition-colors hover:bg-gray-50"
      >
        <ClipboardCheck className="h-3.5 w-3.5 shrink-0" />
        Request Attendance
      </button>
      <button
        type="button"
        onClick={() => notify("Request Overtime")}
        className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-border bg-white px-3 py-4 text-xs font-bold text-primary-dark transition-colors hover:bg-gray-50"
      >
        <UserCog className="h-3.5 w-3.5 shrink-0" />
        Request Overtime
      </button>
    </div>
  );
}
