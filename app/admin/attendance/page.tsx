"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { PortalShell } from "@/components/layout/PortalShell";
import { Card } from "@/components/ui/Card";
import { AttendanceFilters } from "@/components/admin/AttendanceFilters";
import { AttendanceTable } from "@/components/admin/AttendanceTable";
import { AttendanceViewControls, type AttendanceView } from "@/components/admin/AttendanceViewControls";
import { Pagination } from "@/components/admin/Pagination";
import { useAdminAttendance } from "@/components/admin/useAdminAttendance";

export default function AdminAttendancePage() {
  return (
    <AuthGuard requireAdmin>
      <PortalShell>
        <AdminAttendanceContent />
      </PortalShell>
    </AuthGuard>
  );
}

function AdminAttendanceContent() {
  const { filters, updateFilters, setPage, setLimit, records, pagination, loading } = useAdminAttendance();
  const [view, setView] = useState<AttendanceView>("list");

  return (
    <div className="flex flex-col gap-5">
      <AttendanceFilters title="Reports" filters={filters} onChange={updateFilters} />
      <AttendanceViewControls view={view} onViewChange={setView} />

      <Card className="overflow-hidden rounded-2xl p-0">
        <AttendanceTable records={records} loading={loading} view={view} />
      </Card>

      {pagination && pagination.total > 0 && (
        <Pagination pagination={pagination} onPageChange={setPage} onLimitChange={setLimit} />
      )}
    </div>
  );
}
