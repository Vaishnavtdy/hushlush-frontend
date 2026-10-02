import { Building2, IdCard, MapPin } from "lucide-react";
import type { User } from "@/lib/types";

export function InfoCards({ user }: { user: User }) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const cards = [
    {
      label: "Department",
      value: user.department || "—",
      icon: Building2,
      bg: "bg-card-purple",
      iconBg: "bg-card-purple-icon",
    },
    {
      label: "Location",
      value: user.location || "—",
      icon: MapPin,
      bg: "bg-card-peach",
      iconBg: "bg-card-peach-icon",
    },
    {
      label: "Employee ID",
      value: user.employeeId,
      icon: IdCard,
      bg: "bg-card-lime",
      iconBg: "bg-card-lime-icon",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="flex items-center gap-4 rounded-2xl bg-card-blue px-5 py-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-card-blue-icon text-sm font-semibold text-foreground">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-600">Name</p>
          <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
        </div>
      </div>

      {cards.map((card) => (
        <div key={card.label} className={`flex items-center gap-4 rounded-2xl px-5 py-4 ${card.bg}`}>
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${card.iconBg}`}>
            <card.icon className="h-5 w-5 text-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-600">{card.label}</p>
            <p className="truncate text-sm font-semibold text-foreground">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
