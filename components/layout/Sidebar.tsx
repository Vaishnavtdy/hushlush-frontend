"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Watch,
  CalendarClock,
  ClipboardList,
  BarChart2,
  Megaphone,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STATIC_NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Employee", icon: Users },
];

const STATIC_NAV_ITEMS_AFTER = [
  { label: "Shift Schedule", icon: CalendarClock },
  { label: "Leave Tracker", icon: ClipboardList },
  { label: "Reports", icon: BarChart2 },
  { label: "Notice", icon: Megaphone, badge: 1 },
  { label: "Settings", icon: Settings },
];

export function Sidebar({ open = false, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const isHrPortalActive = pathname.startsWith("/portal") || pathname.startsWith("/admin");

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full w-64 shrink-0 -translate-x-full flex-col border-r border-border bg-sidebar-tint transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open && "translate-x-0",
        )}
      >
      <div className="flex items-center px-6 py-6">
        <div className="flex items-center justify-center rounded-2xl bg-white px-3 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed-height SVG logo, no next/image optimization needed */}
          <img src="/assets/hush-lush-logo.svg" alt="Hush Lush" className="h-9 w-auto" />
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        {STATIC_NAV_ITEMS.map((item) => (
          <StaticNavItem key={item.label} {...item} />
        ))}

        <Link
          href="/portal"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            isHrPortalActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50",
          )}
        >
          <Watch className="h-4.5 w-4.5" />
          HR Portal
        </Link>

        {STATIC_NAV_ITEMS_AFTER.map((item) => (
          <StaticNavItem key={item.label} {...item} />
        ))}
      </nav>

      <div className="sticky bottom-0 mx-3 rounded-t-2xl border border-chip-border bg-white px-6 py-5 text-center">
        <p className="text-[10px] font-medium tracking-widest text-muted">POWERED BY</p>
        <p className="text-xs font-bold tracking-widest text-foreground">HUSH LUSH</p>
      </div>
      </aside>
    </>
  );
}

function StaticNavItem({
  label,
  icon: Icon,
  badge,
}: {
  label: string;
  icon: typeof LayoutGrid;
  badge?: number;
}) {
  return (
    <div
      className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500"
      title="Not part of this assessment"
    >
      <Icon className="h-4.5 w-4.5" />
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="rounded-full bg-primary px-1.5 text-xs font-semibold text-white">{badge}</span>
      )}
    </div>
  );
}
