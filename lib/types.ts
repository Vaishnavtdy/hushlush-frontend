export type Role = "ADMIN" | "DEVELOPER";

export type AttendanceStatus = "NOT_STARTED" | "CLOCKED_IN" | "ON_BREAK" | "CLOCKED_OUT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string | null;
  location: string | null;
  employeeId: string;
  avatar: string | null;
}

export interface BreakRecord {
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
}

export interface TodayAttendance {
  attendanceDate: string;
  status: AttendanceStatus;
  clockIn: string | null;
  clockOut: string | null;
  totalBreakSeconds: number;
  totalWorkSeconds: number;
  elapsedWorkingSeconds: number;
  currentBreakStartedAt: string | null;
  breaks: BreakRecord[];
  serverTime: string;
}

/** Same shape as a "today" response; a history day is just an attendance snapshot for a given date. */
export type AttendanceDay = TodayAttendance;

export interface AttendanceHistoryResponse {
  days: AttendanceDay[];
}

export interface AdminAttendanceRecord {
  id: string;
  user: Pick<User, "id" | "name" | "email" | "employeeId" | "avatar" | "department" | "location">;
  attendanceDate: string;
  clockIn: string | null;
  clockOut: string | null;
  status: AttendanceStatus;
  totalBreakSeconds: number;
  totalWorkSeconds: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminAttendanceResponse {
  records: AdminAttendanceRecord[];
  pagination: Pagination;
}
