"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useTranslation } from 'react-i18next'
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  Eye, 
  TrendingUp, 
  MessageSquare, 
  Heart, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Clock
} from "lucide-react"
import DashboardSidebar from "../components/dashboard-sidebar"
import { propertiesService } from "@/lib/api/property"

// Mock data for analytics
const viewsData = [
  { name: "Jan", views: 400 },
  { name: "Feb", views: 300 },
  { name: "Mar", views: 500 },
  { name: "Apr", views: 280 },
  { name: "May", views: 590 },
  { name: "Jun", views: 800 },
  { name: "Jul", views: 810 },
  { name: "Aug", views: 700 },
  { name: "Sep", views: 900 },
  { name: "Oct", views: 950 },
  { name: "Nov", views: 1100 },
  { name: "Dec", views: 950 },
]

const inquiriesData = [
  { name: "Jan", inquiries: 40 },
  { name: "Feb", inquiries: 30 },
  { name: "Mar", inquiries: 45 },
  { name: "Apr", inquiries: 28 },
  { name: "May", inquiries: 59 },
  { name: "Jun", inquiries: 65 },
  { name: "Jul", inquiries: 71 },
  { name: "Aug", inquiries: 60 },
  { name: "Sep", inquiries: 80 },
  { name: "Oct", inquiries: 95 },
  { name: "Nov", inquiries: 110 },
  { name: "Dec", inquiries: 85 },
]

const propertyTypeData = [
  { name: t('constants:property_types.apartment'), value: 45 },
  { name: t('constants:property_types.house'), value: 25 },
  { name: t('constants:property_types.land'), value: 15 },
  { name: t('constants:property_types.commercial'), value: 10 },
  { name: t('constants:property_types.other'), value: 5 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

const popularPropertiesData = [
  { id: 1, title: "Luxury Apartment in Gulshan", views: 1245, inquiries: 32, saves: 78 },
  { id: 2, title: "Modern House in Banani", views: 980, inquiries: 25, saves: 62 },
  { id: 3, title: "Commercial Space in Motijheel", views: 756, inquiries: 18, saves: 41 },
  { id: 4, title: "Residential Plot in Purbachal", views: 645, inquiries: 15, saves: 37 },
  { id: 5, title: "Penthouse in Bashundhara", views: 532, inquiries: 12, saves: 29 },
]

export default function AnalyticsPage() {
  const { t } = useTranslation(['common', 'constants'])
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('month')
  
  // Fetch properties when component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      if (session?.user) {
        try {
          setLoading(true)
          const response = await propertiesService.getMyProperties(session.user.token)
          setProperties(response.data.data || [])
        } catch (error) {
          console.error('Error fetching properties:', error)
          toast({
            title: t('common:error'),
            description: t('common:failed_load_properties'),
            variant: "destructive"
          })
        } finally {
          setLoading(false)
        }
      }
    }
    
    fetchProperties()
  }, [session])
  
  // If not authenticated, redirect to login
  if (!session && !loading) {
    router.push('/auth')
    return null
  }
  
  // Calculate total views, inquiries, and saves
  const totalViews = viewsData.reduce((sum, item) => sum + item.views, 0)
  const totalInquiries = inquiriesData.reduce((sum, item) => sum + item.inquiries, 0)
  const totalSaves = 352 // Mock data
  
  // Calculate percentage changes (mock data)
  const viewsChange = 12.5
  const inquiriesChange = 8.3
  const savesChange = -3.2
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <DashboardSidebar activePage="analytics" />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('common:analytics')}</h1>
                <p className="text-muted-foreground">
                  {t('common:track_property_performance')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Time Range Selector */}
          <Tabs defaultValue="month" className="mb-8" onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="week">{t('common:last_7_days')}</TabsTrigger>
              <TabsTrigger value="month">{t('common:last_30_days')}</TabsTrigger>
              <TabsTrigger value="quarter">{t('common:last_90_days')}</TabsTrigger>
              <TabsTrigger value="year">{t('common:last_12_months')}</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('common:total_views')}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalViews.toLocaleString()}</h3>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {viewsChange > 0 ? (
                    <div className="flex items-center text-green-600">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>{viewsChange}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      <span>{Math.abs(viewsChange)}%</span>
                    </div>
                  )}
                  <span className="text-gray-500 text-sm ml-2">{t('common:vs_previous_period')}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('common:total_inquiries')}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalInquiries.toLocaleString()}</h3>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {inquiriesChange > 0 ? (
                    <div className="flex items-center text-green-600">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>{inquiriesChange}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      <span>{Math.abs(inquiriesChange)}%</span>
                    </div>
                  )}
                  <span className="text-gray-500 text-sm ml-2">vs previous period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{t('common:saved_by_users')}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalSaves.toLocaleString()}</h3>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {savesChange > 0 ? (
                    <div className="flex items-center text-green-600">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>{savesChange}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      <span>{Math.abs(savesChange)}%</span>
                    </div>
                  )}
                  <span className="text-gray-500 text-sm ml-2">vs previous period</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Views Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{t('common:views_trend')}</CardTitle>
                <CardDescription>{t('common:property_views_over_time')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={viewsData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="views" 
                        stroke="#0088FE" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Inquiries Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>{t('common:inquiries_trend')}</CardTitle>
                <CardDescription>{t('common:property_inquiries_over_time')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={inquiriesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="inquiries" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Property Type Distribution & Popular Properties */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Property Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>{t('common:property_type_distribution')}</CardTitle>
                <CardDescription>{t('common:breakdown_by_property_type')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={propertyTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent ? (percent * 100).toFixed(0) : 0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {propertyTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Popular Properties */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t('common:most_popular_properties')}</CardTitle>
                <CardDescription>{t('common:properties_with_highest_engagement')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {popularPropertiesData.map((property) => (
                    <div key={property.id} className="flex flex-col space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900">{property.title}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Last 30 days</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Eye className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Views</p>
                            <p className="font-medium">{property.views}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Inquiries</p>
                            <p className="font-medium">{property.inquiries}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                            <Heart className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Saves</p>
                            <p className="font-medium">{property.saves}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}