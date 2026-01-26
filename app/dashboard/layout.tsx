import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Dashboard | AmarPlot",
  description: "Manage your properties, drafts, and account settings",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)
  
  // If not authenticated, redirect to login
  if (!session) {
    redirect("/auth")
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pass session data to children to avoid re-fetching */}
      {children}
    </div>
  )
}