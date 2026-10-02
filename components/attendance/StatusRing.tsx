"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDuration } from "@/lib/utils";
import type { TodayAttendance } from "@/lib/types";

// 09:00-20:00 shift window, matching the "Morning [09:00am - 08:00pm]" label — used as the
// denominator for the ring's fill percentage and for positioning the current-time needle.
const SHIFT_START_SECONDS = 9 * 3600;
const SHIFT_END_SECONDS = 20 * 3600;
const SHIFT_DURATION_SECONDS = SHIFT_END_SECONDS - SHIFT_START_SECONDS;

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CAP_FRACTION = 0.012; // small decorative dark-maroon accent at each end of the filled arc

function secondsSinceMidnight(date: Date): number {
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}

/** Point on a ring of radius r around (cx,cy), angleDeg measured clockwise from the top (12 o'clock). */
function pointOnRing(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(angleRad), y: cy - r * Math.cos(angleRad) };
}

export function StatusRing({ attendance }: { attendance: TodayAttendance }) {
  const [now, setNow] = useState(() => new Date(attendance.serverTime));

  useEffect(() => {
    const fetchedAtMs = new Date(attendance.serverTime).getTime();
    const localFetchMs = Date.now();
    const tick = () => setNow(new Date(fetchedAtMs + (Date.now() - localFetchMs)));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [attendance.serverTime]);

  const workingSeconds = useMemo(() => {
    if (attendance.status !== "CLOCKED_IN") return attendance.elapsedWorkingSeconds;
    const fetchedAtMs = new Date(attendance.serverTime).getTime();
    return Math.max(0, Math.round(attendance.elapsedWorkingSeconds + (now.getTime() - fetchedAtMs) / 1000));
  }, [attendance.status, attendance.elapsedWorkingSeconds, attendance.serverTime, now]);

  const breakSeconds = useMemo(() => {
    if (attendance.status !== "ON_BREAK" || !attendance.currentBreakStartedAt) return attendance.totalBreakSeconds;
    const breakStartMs = new Date(attendance.currentBreakStartedAt).getTime();
    return attendance.totalBreakSeconds + Math.max(0, Math.round((now.getTime() - breakStartMs) / 1000));
  }, [attendance.status, attendance.totalBreakSeconds, attendance.currentBreakStartedAt, now]);

  const workingFraction = Math.min(1, workingSeconds / SHIFT_DURATION_SECONDS);
  const breakFraction = Math.min(1 - workingFraction, breakSeconds / SHIFT_DURATION_SECONDS);
  const filledFraction = workingFraction + breakFraction;

  const workingLen = workingFraction * CIRCUMFERENCE;
  const breakLen = breakFraction * CIRCUMFERENCE;
  const capLen = CAP_FRACTION * CIRCUMFERENCE;

  const needleSeconds = Math.min(
    SHIFT_DURATION_SECONDS,
    Math.max(0, secondsSinceMidnight(now) - SHIFT_START_SECONDS),
  );
  const needleAngle = (needleSeconds / SHIFT_DURATION_SECONDS) * 360;
  // A short radial tick just inside the ring, not a full-radius line — a line from the exact
  // center would cut straight through the timer text sitting in the middle of the ring.
  const needleBase = pointOnRing(100, 100, 50, needleAngle);
  const needleTip = pointOnRing(100, 100, 78, needleAngle);

  return (
    <div className="relative flex h-64 w-64 items-center justify-center">
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="var(--color-primary-light)" strokeWidth="14" />

        <g transform="rotate(-90 100 100)">
          {workingLen > 0 && (
            <circle
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="14"
              strokeLinecap={breakLen > 0 ? "butt" : "round"}
              strokeDasharray={`${workingLen} ${CIRCUMFERENCE - workingLen}`}
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
          )}
          {breakLen > 0 && (
            <circle
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke="var(--color-success)"
              strokeWidth="14"
              strokeDasharray={`${breakLen} ${CIRCUMFERENCE - breakLen}`}
              strokeDashoffset={-workingLen}
              style={{ transition: "stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease" }}
            />
          )}
          {filledFraction > 0 && (
            <>
              <circle
                cx="100"
                cy="100"
                r={RADIUS}
                fill="none"
                stroke="var(--color-primary-dark)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${capLen} ${CIRCUMFERENCE - capLen}`}
              />
              <circle
                cx="100"
                cy="100"
                r={RADIUS}
                fill="none"
                stroke="var(--color-primary-dark)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={`${capLen} ${CIRCUMFERENCE - capLen}`}
                strokeDashoffset={-(filledFraction * CIRCUMFERENCE - capLen)}
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </>
          )}
        </g>

        <line
          x1={needleBase.x}
          y1={needleBase.y}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke="var(--color-warning)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ transition: "x1 0.6s ease, y1 0.6s ease, x2 0.6s ease, y2 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex h-40 w-40 items-center justify-center rounded-full border border-chip-border bg-white shadow-sm">
        <span className="font-mono text-2xl font-semibold tabular-nums text-warning">
          {formatDuration(workingSeconds)}
        </span>
      </div>
    </div>
  );
}
