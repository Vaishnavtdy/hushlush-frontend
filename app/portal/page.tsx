"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/components/auth/AuthProvider";
import { PortalShell } from "@/components/layout/PortalShell";
import { InfoCards } from "@/components/attendance/InfoCards";
import { WeeklyTimeline } from "@/components/attendance/WeeklyTimeline";
import { StatusRing } from "@/components/attendance/StatusRing";
import { ActionButtons } from "@/components/attendance/ActionButtons";
import { useTodayAttendance } from "@/components/attendance/useTodayAttendance";
import { Card } from "@/components/ui/Card";

export default function PortalPage() {
  return (
    <AuthGuard>
      <PortalShell>
        <PortalContent />
      </PortalShell>
    </AuthGuard>
  );
}

function PortalContent() {
  const { user } = useAuth();
  const { data, loading, actionLoading, clockIn, startBreak, endBreak, clockOut } = useTodayAttendance();

  if (!user || loading || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">
      <div className="flex flex-col gap-6 xl:col-span-2">
        <InfoCards user={user} />

        <Card className="p-6">
          <WeeklyTimeline refreshToken={data.serverTime} />
        </Card>
      </div>

      <Card className="flex flex-col items-center gap-6 rounded-4xl bg-primary-light/40 p-6">
        <p className="self-start text-sm font-semibold text-foreground">Morning [ 09:00am - 08:00pm]</p>
        <StatusRing attendance={data} />
        <ActionButtons
          attendance={data}
          actionLoading={actionLoading}
          onClockIn={clockIn}
          onStartBreak={startBreak}
          onEndBreak={endBreak}
          onClockOut={clockOut}
        />
      </Card>
    </div>
  );
}
