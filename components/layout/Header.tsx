"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, DollarSign, LogOut, Menu, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  DEVELOPER: "Developer",
};

export function Header({ title, onMenuClick }: { title: string; onMenuClick?: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    toast.success("Logged out successfully.");
    router.replace("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-white px-4 py-5 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground hover:bg-gray-50 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground sm:text-xl">{title}</h1>
      </div>

      {/* Search + icon chips are one tightly-grouped cluster pinned to the right (matching the
          reference, which leaves one large gap after the title and keeps everything else close
          together) — not independently spaced flex children, which made the gaps unstable across
          viewport widths. */}
      <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
        <div className="hidden h-10 items-center gap-2 rounded-lg border border-chip-border bg-white px-4 md:flex md:w-56 lg:w-72 sm:h-12">
          <Search className="h-4 w-4 shrink-0 text-foreground/60" />
          <input
            type="search"
            placeholder="Search"
            className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
          />
        </div>

        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-chip-border bg-white hover:bg-gray-50 sm:h-12 sm:w-12"
          aria-label="Billing"
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold text-white sm:h-5 sm:w-5">
            <DollarSign className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
          </span>
        </button>
        <button
          type="button"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-chip-border bg-white text-primary hover:bg-gray-50 sm:h-12 sm:w-12"
          aria-label="Notifications"
        >
          <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
            1
          </span>
        </button>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex h-10 items-center gap-2 rounded-l-full rounded-r-2xl border border-chip-border bg-white py-1 pl-1 pr-2 hover:bg-gray-50 sm:h-12 sm:gap-3 sm:py-1.5 sm:pl-1.5 sm:pr-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary-dark sm:h-10 sm:w-10">
              {initials}
            </div>
            <div className="hidden text-left text-sm leading-tight sm:block">
              <p className="font-semibold text-foreground">Hush Lush Technologies</p>
              <p className="text-muted">
                {user?.name} ({user ? ROLE_LABEL[user.role] : ""})
              </p>
            </div>
            <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted transition-transform", menuOpen && "rotate-180")} />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-chip-border bg-white py-1.5 shadow-lg"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-foreground hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 text-primary" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
