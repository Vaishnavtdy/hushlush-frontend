"use client";

import { cn } from "@/lib/utils";
import type { Pagination as PaginationType } from "@/lib/types";

export function Pagination({ pagination, onPageChange }: { pagination: PaginationType; onPageChange: (page: number) => void }) {
  const { page, totalPages, total, limit } = pagination;
  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(total, page * limit);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-4 sm:flex-row">
      <p className="text-sm text-muted">
        Showing {rangeStart}–{rangeEnd} of {total}
      </p>
      <div className="flex items-center gap-1">
        <PageButton disabled={page === 1} onClick={() => onPageChange(1)} label="First" />
        <PageButton disabled={page === 1} onClick={() => onPageChange(page - 1)} label="Previous" />
        {pages.map((p, idx) => (
          <span key={p} className="flex items-center">
            {idx > 0 && pages[idx - 1] !== p - 1 && <span className="px-1 text-muted">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={cn(
                "h-9 w-9 rounded-lg text-sm font-medium",
                p === page ? "bg-primary text-white" : "text-foreground hover:bg-gray-100",
              )}
            >
              {p}
            </button>
          </span>
        ))}
        <PageButton disabled={page === totalPages} onClick={() => onPageChange(page + 1)} label="Next" />
        <PageButton disabled={page === totalPages} onClick={() => onPageChange(totalPages)} label="Last" />
      </div>
    </div>
  );
}

function PageButton({ disabled, onClick, label }: { disabled: boolean; onClick: () => void; label: string }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {label}
    </button>
  );
}
