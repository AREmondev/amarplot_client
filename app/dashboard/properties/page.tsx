"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DashboardSidebar from "../components/dashboard-sidebar";
import { propertiesService } from "@/lib/api/property";
import { Property } from "@/types";
import Image from "next/image";

export default function PropertiesPage() {
  const { t, i18n, ready } = useTranslation([
    "common",
    "navigation",
    "forms",
    "constants",
  ]);
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null,
  );

  // Fetch properties when component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      if (session?.user) {
        try {
          setLoading(true);
          const response = await propertiesService.getMyProperties(
            session.user.token,
          );
          setProperties(response.data.data || []);
          setFilteredProperties(response.data.data || []);
        } catch (error) {
          console.error("Error fetching properties:", error);
          toast({
            title: t("pages.error"),
            description: t("pages.failed_load_properties"),
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProperties();
  }, [session]);

  // Filter properties based on search query and active tab
  useEffect(() => {
    let result = [...properties];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (property) =>
          property.title?.toLowerCase().includes(query) ||
          property.location?.city?.toLowerCase().includes(query) ||
          property.location?.area?.toLowerCase().includes(query) ||
          property.description?.toLowerCase().includes(query),
      );
    }

    // Filter by status tab
    if (activeTab !== "all") {
      result = result.filter((property) => property.status === activeTab);
    }

    setFilteredProperties(result);
  }, [properties, searchQuery, activeTab]);
  const [btnStateLoading, setBtnStateLoading] = useState(false);
  // Handle property deletion
  const handleDeleteProperty = async () => {
    if (!propertyToDelete || !session?.user) return;
    setBtnStateLoading(true);
    try {
      await propertiesService.deleteProperty(propertyToDelete._id);

      // Update local state
      setProperties((prev) =>
        prev.filter((p) => p._id !== propertyToDelete._id),
      );
      setFilteredProperties((prev) =>
        prev.filter((p) => p._id !== propertyToDelete._id),
      );

      toast({
        title: t("pages.success"),
        description: t("pages.property_deleted_success"),
      });

      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: t("pages.error"),
        description: t("pages.property_delete_error"),
        variant: "destructive",
      });
    } finally {
      setBtnStateLoading(false);
    }
  };

  // Handle property edit
  const handleEditProperty = (property: Property) => {
    router.push(`/edit-property/${property._id}`);
  };

  // Handle property view
  const handleViewProperty = (property: Property) => {
    router.push(`/property/${property._id}`);
  };

  // If not authenticated, redirect to login
  if (!session && !loading) {
    router.push("/auth");
    return null;
  }

  // Count properties by status
  const publishedCount = properties.filter(
    (p) => p.status === "published",
  ).length;
  const pendingCount = properties.filter((p) => p.status === "pending").length;
  const draftCount = properties.filter((p) => p.status === "draft").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <DashboardSidebar activePage="properties" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t("pages.my_properties")}
              </h1>
              <p className="text-gray-600 mt-1">
                {t("pages.manage_property_listings")}
              </p>
            </div>
            <Button
              className="mt-4 md:mt-0"
              onClick={() => router.push("/add-property")}
            >
              <Plus className="mr-2 h-5 w-5" />
              {t("forms:property.add_property")}
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder={t("pages.search_properties")}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="mr-2 h-5 w-5" />
              {t("pages.filter")}
            </Button>
          </div>

          {/* Tabs */}
          <Tabs
            defaultValue="all"
            className="mb-8"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="all">
                {t("pages.all")}
                <Badge variant="secondary" className="ml-2">
                  {properties.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="published">
                {t("pages.published")}
                <Badge variant="secondary" className="ml-2">
                  {publishedCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                {t("pages.pending")}
                <Badge variant="secondary" className="ml-2">
                  {pendingCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="draft">
                {t("pages.drafts")}
                <Badge variant="secondary" className="ml-2">
                  {draftCount}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {renderPropertyList(filteredProperties)}
            </TabsContent>

            <TabsContent value="published" className="mt-6">
              {renderPropertyList(filteredProperties)}
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              {renderPropertyList(filteredProperties)}
            </TabsContent>

            <TabsContent value="draft" className="mt-6">
              {renderPropertyList(filteredProperties)}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("pages.delete_property")}</DialogTitle>
            <DialogDescription>
              {t("pages.delete_property_confirmation")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              isLoading={btnStateLoading}
              onClick={handleDeleteProperty}
            >
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  // Format location for display
  const formatLocation = (location: any) => {
    if (!location) return t("pages.location_not_specified");
    return (
      [location.area, location.city].filter(Boolean).join(", ") ||
      t("pages.location_details_unavailable")
    );
  };

  // Helper function to render property list
  function renderPropertyList(properties: Property[]) {
    if (loading) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">{t("pages.loading_properties")}</p>
        </div>
      );
    }

    if (properties.length === 0) {
      return (
        <div className="text-center py-12 border rounded-lg bg-white">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("pages.no_properties_found")}
          </h3>
          <p className="text-gray-500 mb-6">
            {t("pages.no_properties_matching_criteria")}
          </p>
          <Button onClick={() => router.push("/add-property")}>
            <Plus className="mr-2 h-5 w-5" />
            {t("forms:add_new_property")}
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6">
        {properties.map((property) => (
          <Card key={property._id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Property Image */}
              <div className="w-full md:w-48 h-48 bg-gray-200 relative">
                {property.images && property.images.length > 0 ? (
                  <Image
                    src={property.images[0]}
                    alt={property.title || "Property"}
                    className="w-full h-full object-cover"
                    width={192}
                    height={192}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    {t("pages.no_image")}
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge
                    className={`
                    ${property.status === "published" ? "bg-green-100 text-green-800" : ""}
                    ${property.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                    ${property.status === "draft" ? "bg-blue-100 text-blue-800" : ""}
                  `}
                  >
                    {property.status === "published" && (
                      <CheckCircle className="mr-1 h-3 w-3" />
                    )}
                    {property.status === "pending" && (
                      <AlertCircle className="mr-1 h-3 w-3" />
                    )}
                    {property.status === "draft" && (
                      <Clock className="mr-1 h-3 w-3" />
                    )}
                    {t(`constants:property_statuses.${property.status}`)}
                  </Badge>
                </div>
              </div>

              {/* Property Details */}
              <div className="flex-1 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {property.title || t("pages.untitled_property")}
                    </h3>
                    <div className="flex items-center mt-1 text-gray-500 text-sm">
                      <span>
                        {property.location
                          ? `${property.location.city || ""}, ${property.location.area || ""}`.replace(
                              /^, |, $/,
                              "",
                            )
                          : t("pages.location_not_specified")}
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        {property.type
                          ? t(
                              `constants:property_types.${property.type.toLowerCase()}`,
                            )
                          : t("pages.type_not_specified")}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewProperty(property)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("view")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditProperty(property)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 hover:!bg-red-500 hover:text-white"
                          onClick={() => {
                            setPropertyToDelete(property);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <p className="mt-3 text-gray-600 line-clamp-2">
                  {property.description || t("pages.no_description_available")}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-gray-900">
                      {property.price
                        ? `৳${property.price.toLocaleString()}`
                        : t("pages.price_not_set")}
                    </span>
                    {property.size && (
                      <span className="text-sm text-gray-500 ml-2">
                        {property.size} sqft
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProperty(property)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      {t("view")}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleEditProperty(property)}
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      {t("edit")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
}
