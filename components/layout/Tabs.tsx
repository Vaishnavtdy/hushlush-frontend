"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "HR Portal", href: "/portal" },
  { label: "Employee Login", href: "/admin/attendance" },
];

export function AdminTabs() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-8 border-b border-chip-border px-8">
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "border-b-2 pb-3 pt-2 text-sm font-medium transition-colors",
              active ? "border-primary text-foreground" : "border-transparent text-muted hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
