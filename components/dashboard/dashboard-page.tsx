"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Eye, Clock, CheckCircle, AlertCircle, Plus, TrendingUp, Calendar, ArrowRight } from "lucide-react"
import { DraftData, Property } from "@/types"


interface DashboardProps {
  properties: Property[]
  drafts: DraftData[]
  onPostNew: () => void
  onViewListings: () => void
  onViewDrafts: () => void
}

const DashboardComponent = ({ properties, drafts, onPostNew, onViewListings, onViewDrafts }: DashboardProps) => {
  const publishedCount = properties.filter((p) => p.status === "published").length
  const pendingCount = properties.filter((p) => p.status === "pending").length
  const draftCount = drafts.length
  const totalViews = 1234 // Mock data

  const recentProperties = properties.slice(0, 3)

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome back, John! 👋</h2>
            <p className="text-gray-600 mb-4">
              Ready to list your next property? It&apos;s as easy as posting on social media.
            </p>
            <Button
              onClick={onPostNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Post New Property
            </Button>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Home className="w-16 h-16 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Published</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">{publishedCount}</div>
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Active listings
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">{pendingCount}</div>
            <p className="text-xs text-orange-600 mt-1">Under review</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
            <Clock className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">{draftCount}</div>
            <p className="text-xs text-blue-600 mt-1">Ready to complete</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
            <Eye className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-purple-600 mt-1 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Properties</CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={onViewListings}>
                <span>View All</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentProperties.length === 0 ? (
              <div className="text-center py-8">
                <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                <p className="text-gray-600 mb-4">Start by posting your first property listing</p>
                <Button onClick={onPostNew} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Your First Property
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProperties.map((property) => (
                  <div
                    key={property._id}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{property.title}</h4>
                      <p className="text-sm text-gray-600 truncate">{property.location.address}</p>
                      <p className="text-sm font-medium text-blue-600">{property.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          property.status === "published"
                            ? "bg-green-100 text-green-800"
                            : property.status === "pending"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {property.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Drafts */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Drafts</CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={onViewDrafts}>
                <span>View All</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {drafts.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts saved</h3>
                <p className="text-gray-600 mb-4">Your saved drafts will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {drafts.slice(0, 3).map((draft) => (
                  <div
                    key={draft._id}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{draft.data.title || "Untitled Property"}</h4>
                      <p className="text-sm text-gray-600">Step {draft.step} of 4</p>
                      <p className="text-sm text-gray-500">{new Date(draft.lastSaved).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-600 rounded-full transition-all"
                          style={{ width: `${(draft.step / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardComponent