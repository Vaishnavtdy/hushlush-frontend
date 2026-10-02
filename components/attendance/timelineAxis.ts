// Shared axis for the weekly "Attendance Summary" timeline. A 6am-11pm business window (rather
// than a full 24h axis) keeps bars wide enough to read — the reference screenshot's full-24h-style
// axis produces very thin bars, and its hour labels are themselves inconsistent (repeated "03am").
export const WINDOW_START_HOUR = 6;
export const WINDOW_END_HOUR = 23;
const WINDOW_MINUTES = (WINDOW_END_HOUR - WINDOW_START_HOUR) * 60;

export function timeToPercent(date: Date): number {
  const minutesOfDay = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
  const minutesFromStart = minutesOfDay - WINDOW_START_HOUR * 60;
  return Math.min(100, Math.max(0, (minutesFromStart / WINDOW_MINUTES) * 100));
}

function formatHourLabel(hour24: number): string {
  const period = hour24 < 12 ? "am" : "pm";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${String(hour12).padStart(2, "0")}${period}`;
}

/** Major labelled hours every 3h, with minor unlabeled tick marks for the hours in between. */
export const AXIS_HOURS: { hour: number; label: string | null }[] = Array.from(
  { length: WINDOW_END_HOUR - WINDOW_START_HOUR + 1 },
  (_, i) => {
    const hour = WINDOW_START_HOUR + i;
    const major = (hour - WINDOW_START_HOUR) % 3 === 0;
    return { hour, label: major ? formatHourLabel(hour) : null };
  },
);
