"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type AttendanceView = "list" | "table";

export function AttendanceViewControls({
  view,
  onViewChange,
}: {
  view: AttendanceView;
  onViewChange: (view: AttendanceView) => void;
}) {
  const notAvailable = () => toast.info("Multiple locations aren't available in this demo.");

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={notAvailable}
          aria-label="Previous location"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-primary">Location 1</span>
        <button
          type="button"
          onClick={notAvailable}
          aria-label="Next location"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex rounded-xl border border-border p-1 text-sm font-medium">
        <button
          type="button"
          onClick={() => onViewChange("list")}
          className={cn("rounded-lg px-3 py-1.5 transition-colors", view === "list" ? "bg-primary-light text-primary-dark" : "text-muted")}
        >
          list View
        </button>
        <button
          type="button"
          onClick={() => onViewChange("table")}
          className={cn("rounded-lg px-3 py-1.5 transition-colors", view === "table" ? "bg-primary-light text-primary-dark" : "text-muted")}
        >
          Table view
        </button>
      </div>
    </div>
  );
}
