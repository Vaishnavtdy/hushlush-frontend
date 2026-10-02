"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { PortalShell } from "@/components/layout/PortalShell";
import { Card } from "@/components/ui/Card";
import { AttendanceFilters } from "@/components/admin/AttendanceFilters";
import { AttendanceTable } from "@/components/admin/AttendanceTable";
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
  const { filters, updateFilters, setPage, records, pagination, loading } = useAdminAttendance();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Reports</h2>
        <p className="text-sm text-muted">Attendance history for every employee, pulled live from the database.</p>
      </div>

      <Card className="flex flex-col gap-5 rounded-lg p-6">
        <AttendanceFilters filters={filters} onChange={updateFilters} />
        <AttendanceTable records={records} loading={loading} />
        {pagination && pagination.total > 0 && <Pagination pagination={pagination} onPageChange={setPage} />}
      </Card>
    </div>
  );
}
