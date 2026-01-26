"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// Define types for properties and drafts
type Property = {
  id: string;
  title: string;
  status: "published" | "pending" | "draft";
  updatedAt: string;
  // Add other property fields as needed
};

type DraftData = {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
  // Add other draft fields as needed
};
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Building,
  Clock,
  BarChart3,
  Settings,
  Plus,
  ArrowRight,
  TrendingUp,
  Eye,
  CheckCircle,
  AlertCircle,
  Calendar,
  Home,
} from "lucide-react";
import PriceTrendChart from "@/components/dashboard/price-trend-chart";
import DashboardSidebar from "../components/dashboard-sidebar";
import { propertiesService } from "@/lib/api/property";

export default function DashboardOverviewPage() {
  const { t, i18n, ready } = useTranslation([
    "common",
    "navigation",
    "forms",
    "constants",
  ]);

  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const [properties, setProperties] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    published: 0,
    pending: 0,
    drafts: 0,
    totalViews: 0,
  });

  // Fetch properties and drafts when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (session?.user) {
        try {
          setLoading(true);

          // Fetch user's properties
          const response = await propertiesService.getMyProperties(
            session.user.token,
          );
          setProperties(response.data.data || []);

          // Calculate stats
          const publishedCount =
            response.data.data?.filter(
              (p: Property) => p.status === "published",
            ).length || 0;
          const pendingCount =
            response.data.data?.filter((p: Property) => p.status === "pending")
              .length || 0;
          const draftCount =
            response.data.data?.filter((p: Property) => p.status === "draft")
              .length || 0;

          setStats({
            published: publishedCount,
            pending: pendingCount,
            drafts: draftCount,
            totalViews: 1234, // Mock data for now
          });
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
          toast({
            title: "Error",
            description:
              "Failed to load your properties. Please try again later.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [session]);

  // If not authenticated, redirect to login
  if (!session && !loading) {
    router.push("/auth");
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <DashboardSidebar activePage="overview" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t("pages.dashboard_overview")}
            </h1>
            <p className="text-gray-600 mt-1">
              {t("pages.welcome_back")}, {session?.user?.name || "User"}!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("pages.published_properties")}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">
                      {stats.published}
                    </h3>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto px-5 py-2 border border-primary hover:bg-primary  text-sm text-primary"
                    onClick={() => router.push("/dashboard/properties")}
                  >
                    View all properties
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("pages.pending_approval")}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">
                      {stats.pending}
                    </h3>
                  </div>
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto px-5 py-2 border border-primary hover:bg-primary  text-sm text-primary"
                    onClick={() => router.push("/dashboard/properties")}
                  >
                    Check status
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("pages.saved_drafts")}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">
                      {stats.drafts}
                    </h3>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto px-5 py-2 border border-primary hover:bg-primary  text-sm text-primary"
                    onClick={() => router.push("/dashboard/drafts")}
                  >
                    Continue editing
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("pages.total_views")}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">
                      {stats.totalViews}
                    </h3>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto px-5 py-2 border border-primary hover:bg-primary  text-sm text-primary"
                    onClick={() => router.push("/dashboard/analytics")}
                  >
                    View analytics
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Trend Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t("pages.property_price_trends")}</CardTitle>
              <CardDescription>
                {t("pages.average_property_prices_6_months")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <PriceTrendChart />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t("pages.recent_activity")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {loading ? (
                    <p className="text-center text-gray-500">
                      {t("pages.loading_activity")}
                    </p>
                  ) : properties.length > 0 ? (
                    properties.slice(0, 5).map((property, index) => (
                      <div
                        key={property.id || index}
                        className="flex items-start space-x-4"
                      >
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          {property.status === "published" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : property.status === "pending" ? (
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">
                              {property.title || t("pages.untitled_property")}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {new Date(
                                property.updatedAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {property.status === "published"
                              ? t("pages.property_published")
                              : property.status === "pending"
                                ? t("pages.awaiting_approval")
                                : t("pages.draft_saved")}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      {t("pages.no_recent_activity")}
                    </p>
                  )}
                </div>
              </CardContent>
              {properties.length > 5 && (
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/dashboard/properties")}
                  >
                    {t("pages.view_all_activity")}
                  </Button>
                </CardFooter>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("pages.quick_actions")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    className="w-full justify-start"
                    onClick={() => router.push("/add-property")}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    {t("pages.add_new_property")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push("/dashboard/properties")}
                  >
                    <Building className="mr-2 h-5 w-5" />
                    {t("pages.manage_properties")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push("/dashboard/drafts")}
                  >
                    <Clock className="mr-2 h-5 w-5" />
                    {t("pages.continue_drafts")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => router.push("/dashboard/analytics")}
                  >
                    <BarChart3 className="mr-2 h-5 w-5" />
                    {t("pages.view_analytics")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
