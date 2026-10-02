"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-primary-dark">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-semibold text-foreground">Access denied</h1>
      <p className="max-w-sm text-sm text-muted">
        You do not have permission to access this page.
      </p>
      <Link href="/portal">
        <Button variant="outline">Back to my attendance</Button>
      </Link>
    </div>
  );
}
