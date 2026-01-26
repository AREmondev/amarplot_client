'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import AdminPropertyList from "@/components/admin/admin-property-list"
import { BarChart, LineChart } from "lucide-react" // Assuming these are available or will be added

export default function AdminDashboardContent() {
  // Placeholder data - In a real application, this would come from API calls
  const stats = {
    totalUsers: 1250,
    newUsersToday: 15,
    totalProperties: 5300,
    activeListings: 3100,
    totalCommunities: 120,
    activeCommunities: 85,
  }

  const recentActivity = [
    { id: 1, type: "New User", description: "John Doe registered", timestamp: "2 hours ago" },
    { id: 2, type: "New Listing", description: "Apartment in Gulshan posted", timestamp: "4 hours ago" },
    { id: 3, type: "Community Join", description: "Jane Smith joined 'Dhaka Renters'", timestamp: "1 day ago" },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+ {stats.newUsersToday} new users today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">{stats.activeListings} active listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Communities</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCommunities}</div>
            <p className="text-xs text-muted-foreground">{stats.activeCommunities} active communities</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.type}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <div className="ml-auto font-medium text-xs text-muted-foreground">{activity.timestamp}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Manage user accounts, roles, and permissions.</p>
            {/* Add user management components here */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Content Moderation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Review and moderate property listings, community posts, and comments.</p>
            {/* Add content moderation components here */}
          </CardContent>
        </Card>
      </div>

      <AdminPropertyList />
    </div>
  )
}
