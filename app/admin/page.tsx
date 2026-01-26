'use client'

// IMPORTANT: This page should be protected by server-side authentication and authorization.
// Only users with the 'Admin/Moderator' role should be able to access this page.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminDashboardContent from "@/components/admin/admin-dashboard-content"
import WithVerification from "@/components/common/with-verification";

export default function AdminPage() {
  return (
    <WithVerification>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <AdminDashboardContent />
          </main>
        </div>
      </div>
    </WithVerification>
  )
}