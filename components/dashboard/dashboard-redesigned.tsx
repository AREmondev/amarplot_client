"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Home, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  LayoutDashboard,
  ListFilter,
  FileEdit,
  MessageSquare,
  Bell,
  Settings,
  PenSquare,
  BarChart3,
  Users,
  Building,
  Edit,
  Trash2,
  Search,
  MapPin
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import PriceTrendChart from "./price-trend-chart"
import { Property, DraftData, User } from "@/types"

interface DashboardProps {
  properties: Property[]
  drafts: DraftData[]
  onPostNew: () => void
  onViewListings: () => void
  onViewDrafts: () => void
  onEditProperty?: (property: Property) => void
  onDeleteProperty?: (id: string) => void
  isLoading?: boolean
  user?: User
}

const DashboardRedesigned = ({ 
  properties, 
  drafts, 
  onPostNew, 
  onViewListings, 
  onViewDrafts,
  onEditProperty,
  onDeleteProperty,
  isLoading = false,
  user = {
    _id: "user1",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg",
    isEmailVerified: true,
    isPhoneVerified: true,
    isNIDVerified: false,
    stats: {
      listings: properties.length,
      communities: 3,
      posts: 12,
      comments: 28
    },
    savedProperties: [],
    joinedCommunities: [],
    joinedAt: new Date().toISOString()
  }
}: DashboardProps) => {
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [searchQuery, setSearchQuery] = useState<string>("") 

  const publishedCount = isLoading ? 0 :  properties.filter((p) => p.status === "published").length
  const pendingCount = isLoading ? 0 : properties.filter((p) => p.status === "pending").length
  const draftCount = isLoading ? 0 : drafts.length
  const totalViews = 1234 // Mock data

  const recentProperties = isLoading ? [] : properties.slice(0, 5)
  const filteredProperties = isLoading ? [] : properties.filter(property => 
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              <p className="text-xs text-gray-500">Property Owner</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === "overview" ? "bg-blue-50 text-blue-700" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard className="mr-2 h-5 w-5" />
            Overview
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === "properties" ? "bg-blue-50 text-blue-700" : ""}`}
            onClick={() => setActiveTab("properties")}
          >
            <Building className="mr-2 h-5 w-5" />
            My Properties
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === "drafts" ? "bg-blue-50 text-blue-700" : ""}`}
            onClick={() => setActiveTab("drafts")}
          >
            <Clock className="mr-2 h-5 w-5" />
            Drafts
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === "analytics" ? "bg-blue-50 text-blue-700" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Analytics
          </Button>
          
          <Separator className="my-2" />
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === "communities" ? "bg-blue-50 text-blue-700" : ""}`}
            onClick={() => setActiveTab("communities")}
          >
            <Users className="mr-2 h-5 w-5" />
            Communities
          </Button>
          
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === "notifications" ? "bg-blue-50 text-blue-700" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className="mr-2 h-5 w-5" />
            Notifications
          </Button>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <Button 
            onClick={onPostNew}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Property
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-white p-4 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <ListFilter className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setActiveTab("overview")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Overview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("properties")}>
                  <Building className="mr-2 h-4 w-4" />
                  My Properties
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("drafts")}>
                  <Clock className="mr-2 h-4 w-4" />
                  Drafts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("analytics")}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("communities")}>
                  <Users className="mr-2 h-4 w-4" />
                  Communities
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("notifications")}>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
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
                    {isLoading ? (
                      <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <div className="text-2xl md:text-3xl font-bold text-gray-900">{publishedCount}</div>
                    )}
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
                    {isLoading ? (
                      <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <div className="text-2xl md:text-3xl font-bold text-gray-900">{pendingCount}</div>
                    )}
                    <p className="text-xs text-orange-600 mt-1">Under review</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Drafts</CardTitle>
                    <Clock className="h-5 w-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <div className="text-2xl md:text-3xl font-bold text-gray-900">{draftCount}</div>
                    )}
                    <p className="text-xs text-blue-600 mt-1">Ready to complete</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
                    <Eye className="h-5 w-5 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <div className="text-2xl md:text-3xl font-bold text-gray-900">{totalViews.toLocaleString()}</div>
                    )}
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
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={() => setActiveTab("properties")}>
                      <span>View All</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      {Array(3).fill(0).map((_, index) => (
                        <div
                          key={`skeleton-${index}`}
                          className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="w-12 h-12 rounded-lg bg-gray-200 animate-pulse" />
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                            <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                            <div className="h-3 w-1/4 bg-gray-200 animate-pulse rounded"></div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="px-2 py-1 rounded-full w-16 h-6 bg-gray-200 animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentProperties.length === 0 ? (
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
                              className={`px-2 py-1 rounded-full text-xs font-medium ${property.status === "published"
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
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={() => setActiveTab("drafts")}>
                        <span>View All</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-3">
                        {Array(3).fill(0).map((_, index) => (
                          <div
                            key={`draft-skeleton-${index}`}
                            className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl"
                          >
                            <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                              <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                              <div className="h-3 w-1/4 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : drafts.length === 0 ? (
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

              {/* Analytics Preview */}
              <Card className="border-0 shadow-sm overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">Property Price Trends</CardTitle>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={() => setActiveTab("analytics")}>
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-64">
                    <PriceTrendChart />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Properties Tab */}
          {activeTab === "properties" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
                  <p className="text-gray-600">Manage all your property listings</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Search properties..." 
                      className="pl-9" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button onClick={onPostNew} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Property
                  </Button>
                </div>
              </div>

              {/* Properties List */}
              <div className="space-y-4">
                {isLoading ? (
                  // Loading skeletons for properties
                  Array(3).fill(0).map((_, index) => (
                    <Card key={`property-skeleton-${index}`} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 h-48 md:h-auto relative bg-gray-200 animate-pulse">
                        </div>
                        <div className="flex-1 p-4 md:p-6 flex flex-col">
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
                                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded mb-2"></div>
                              </div>
                              <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                            
                            <div className="h-4 w-full bg-gray-200 animate-pulse rounded mb-2 mt-4"></div>
                            <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded mb-4"></div>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
                              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
                              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                            <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
                            <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
                            <div className="h-9 w-24 bg-gray-200 animate-pulse rounded"></div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : filteredProperties.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    {searchQuery ? (
                      <>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                        <p className="text-gray-600 mb-4">Start by posting your first property listing</p>
                        <Button onClick={onPostNew} className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Post Your First Property
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  filteredProperties.map((property) => (
                    <Card key={property._id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 h-48 md:h-auto relative">
                          <img 
                            src={property.images[0] || "/placeholder.svg"} 
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                          <Badge 
                            className={`absolute top-2 left-2 ${property.status === "published"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : property.status === "pending"
                                ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                              }`}
                          >
                            {property.status}
                          </Badge>
                        </div>
                        <div className="flex-1 p-4 md:p-6 flex flex-col">
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">{property.title}</h3>
                                <p className="text-gray-600 flex items-center text-sm mb-2">
                                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                  {property.location.address}
                                </p>
                              </div>
                              <p className="text-lg font-bold text-blue-600">{property.price}</p>
                            </div>
                            
                            <p className="text-gray-700 line-clamp-2 mb-4">{property.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                                {property.type}
                              </Badge>
                              <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200">
                                Posted: {new Date(property.createdAt).toLocaleDateString()}
                              </Badge>
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200">
                                <Eye className="h-3 w-3 mr-1" /> 42 views
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/property/${property._id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                            {onEditProperty && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => onEditProperty(property)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            )}
                            {onDeleteProperty && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => onDeleteProperty(property._id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Drafts Tab */}
          {activeTab === "drafts" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">My Drafts</h2>
                  <p className="text-gray-600">Continue working on your saved property listings</p>
                </div>
                <Button onClick={onPostNew} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  New Draft
                </Button>
              </div>

              {/* Drafts List */}
              <div className="space-y-4">
                {isLoading ? (
                  // Loading skeletons for drafts
                  Array(3).fill(0).map((_, index) => (
                    <Card key={`draft-skeleton-${index}`} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="h-6 w-48 bg-gray-200 animate-pulse rounded mb-2"></div>
                            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                          </div>
                          <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-gray-300 animate-pulse rounded-full"
                              style={{ width: `50%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-gray-300">
                            <span>Basic Info</span>
                            <span>Location</span>
                            <span>Images</span>
                            <span>Review</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-32 h-4 bg-gray-200 animate-pulse rounded mr-2"></div>
                            <div className="flex-1 h-4 bg-gray-200 animate-pulse rounded"></div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-32 h-4 bg-gray-200 animate-pulse rounded mr-2"></div>
                            <div className="flex-1 h-4 bg-gray-200 animate-pulse rounded"></div>
                          </div>
                          <div className="flex items-center">
                            <div className="w-32 h-4 bg-gray-200 animate-pulse rounded mr-2"></div>
                            <div className="flex-1 h-4 bg-gray-200 animate-pulse rounded"></div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                          <div className="h-10 w-40 bg-gray-200 animate-pulse rounded"></div>
                          <div className="h-10 w-36 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : drafts.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts saved</h3>
                    <p className="text-gray-600 mb-4">Start creating a new property listing</p>
                    <Button onClick={onPostNew} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Start New Property
                    </Button>
                  </div>
                ) : (
                  drafts.map((draft) => (
                    <Card key={draft._id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {draft.data.title || "Untitled Property"}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              Last saved: {new Date(draft.lastSaved).toLocaleString()}
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            Step {draft.step} of 4
                          </Badge>
                        </div>
                        
                        <div className="mb-4">
                          <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div
                              className="h-2 bg-blue-600 rounded-full transition-all"
                              style={{ width: `${(draft.step / 4) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>Basic Info</span>
                            <span>Location</span>
                            <span>Images</span>
                            <span>Review</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {draft.data.type && (
                            <div className="flex items-center text-sm">
                              <span className="text-gray-600 w-32">Property Type:</span>
                              <span className="text-gray-900">{draft.data.type}</span>
                            </div>
                          )}
                          {draft.data.price && (
                            <div className="flex items-center text-sm">
                              <span className="text-gray-600 w-32">Price:</span>
                              <span className="text-gray-900">{draft.data.price}</span>
                            </div>
                          )}
                          {draft.data.location?.address && (
                            <div className="flex items-center text-sm">
                              <span className="text-gray-600 w-32">Location:</span>
                              <span className="text-gray-900">{draft.data.location.address}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <PenSquare className="h-4 w-4 mr-2" />
                            Continue Editing
                          </Button>
                          <Button variant="outline">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Draft
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
                <p className="text-gray-600">Track performance of your property listings</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Total Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <div className="text-3xl font-bold text-gray-900">{totalViews.toLocaleString()}</div>
                    )}
                    {isLoading ? (
                      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mt-1"></div>
                    ) : (
                      <p className="text-sm text-green-600 mt-1">+12% from last month</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Inquiries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <div className="text-3xl font-bold text-gray-900">28</div>
                    )}
                    {isLoading ? (
                      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mt-1"></div>
                    ) : (
                      <p className="text-sm text-green-600 mt-1">+5% from last month</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <div className="text-3xl font-bold text-gray-900">2.3%</div>
                    )}
                    {isLoading ? (
                      <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mt-1"></div>
                    ) : (
                      <p className="text-sm text-red-600 mt-1">-0.5% from last month</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border-0 shadow-sm overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Property Price Trends</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="h-80 bg-gray-100 flex items-center justify-center">
                      <div className="w-full h-64 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  ) : (
                    <div className="h-80">
                      <PriceTrendChart />
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Top Performing Properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isLoading ? (
                        Array(3).fill(0).map((_, index) => (
                          <div key={`top-property-skeleton-${index}`} className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                            <div className="flex-1 min-w-0 space-y-2">
                              <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                              <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                            <div className="text-right space-y-2">
                              <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
                              <div className="h-3 w-8 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        recentProperties.slice(0, 3).map((property, index) => (
                          <div key={property._id} className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{property.title}</h4>
                              <p className="text-sm text-gray-600 truncate">{property.location.address}</p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">245</div>
                              <p className="text-xs text-gray-600">views</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Visitor Demographics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isLoading ? (
                        Array(4).fill(0).map((_, index) => (
                          <div key={`demographic-skeleton-${index}`} className="flex justify-between items-center">
                            <div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div>
                            <div className="w-12 h-4 bg-gray-200 animate-pulse rounded"></div>
                            <div className="w-1/2 h-2 bg-gray-200 animate-pulse rounded"></div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Dhaka</span>
                            <span className="text-gray-900 font-medium">65%</span>
                            <div className="w-1/2 h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-blue-600 rounded-full" style={{ width: '65%' }} />
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Chittagong</span>
                            <span className="text-gray-900 font-medium">18%</span>
                            <div className="w-1/2 h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-blue-600 rounded-full" style={{ width: '18%' }} />
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Sylhet</span>
                            <span className="text-gray-900 font-medium">12%</span>
                            <div className="w-1/2 h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-blue-600 rounded-full" style={{ width: '12%' }} />
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Others</span>
                            <span className="text-gray-900 font-medium">5%</span>
                            <div className="w-1/2 h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-blue-600 rounded-full" style={{ width: '5%' }} />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}



          {/* Communities Tab */}
          {activeTab === "communities" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Communities</h2>
                <p className="text-gray-600">Communities you've joined or created</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.stats.communities > 0 ? (
                  Array(user.stats.communities).fill(0).map((_, index) => (
                    <Card key={index} className="border-0 shadow-sm overflow-hidden">
                      <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500" />
                      <CardContent className="pt-0 -mt-8">
                        <Avatar className="h-16 w-16 border-4 border-white">
                          <AvatarImage src="/placeholder.svg" alt="Community" />
                          <AvatarFallback>C{index + 1}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-xl font-semibold mt-2">Community {index + 1}</h3>
                        <p className="text-gray-600 text-sm mb-4">A community for property enthusiasts</p>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>125 members</span>
                          <span>15 posts</span>
                        </div>
                        <Button className="w-full mt-4" asChild>
                          <Link href="/communities">
                            View Community
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No communities joined</h3>
                    <p className="text-gray-600 mb-4">Join communities to connect with other property owners</p>
                    <Button asChild>
                      <Link href="/communities">
                        <Users className="w-4 h-4 mr-2" />
                        Explore Communities
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                <p className="text-gray-600">Stay updated with activity on your properties</p>
              </div>
              
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                    <p className="text-gray-600 mb-4">When you receive notifications, they will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}


        </div>
      </div>
    </div>
  )
}

export default DashboardRedesigned