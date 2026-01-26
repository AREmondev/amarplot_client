"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PerfectMapSearch } from "@/components/map/perfect-map-search";
import { GoogleMapsIntegration, GoogleMapsRef } from "@/components/map/google-maps-integration";
import { MapPropertyList } from "@/components/map/map-property-list";
import { AdvancedMapFilters } from "@/components/map/advanced-map-filters";
import { MapResultOverlay } from "@/components/map/map-result-overlay";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  PanelLeftIcon as SidebarLeft,
  PanelLeftIcon as SidebarRight,
  Filter,
  Search,
  Target,
  List,
  MapIcon,
  X,
  Settings,
} from "lucide-react";
import { propertiesService, Property } from "@/lib/api/property";
import {
  TRANSACTION_TYPES,
  PROPERTY_TYPES,
  PropertyType,
  TransactionType,
} from "@/lib/constants";

export function MapSearchPage() {
  const searchParams = useSearchParams();

  // Get initial values from URL parameters
  const initialLocation = searchParams.get("location") || ""
  const initialPropertyType = searchParams.get("type") || null
  const initialTransactionType = searchParams.get("transaction_type") || "sell";

  const [showPropertyList, setShowPropertyList] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState(initialLocation);
  const [viewMode, setViewMode] = useState<"split" | "map" | "list">("split");
  const [useGoogleMaps, setUseGoogleMaps] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 2500000,
    propertyType: initialPropertyType ? [initialPropertyType] : [],
    minBedrooms: null as number | null,
    maxBedrooms: null as number | null,
    minBathrooms: null as number | null,
    maxBathrooms: null as number | null,
    isFeatured: false,
    isHotProduct: false,
    isVerified: false,
    isUrgentSale: false,
    isFurnished: false,
    hasParking: false,
    isNewConstruction: false,
    isReadyToMove: false,
    furnishingType: null as string | null,
    amenities: [] as string[],
    minLotSize: null as number | null,
    maxLotSize: null as number | null,
    minFloorNumber: null as number | null,
    maxFloorNumber: null as number | null,
    minTotalFloors: null as number | null,
    maxTotalFloors: null as number | null,
    constructionStatus: null as string | null,
    minYearBuilt: null as number | null,
    maxYearBuilt: null as number | null,
    facingDirection: null as string | null,
    propertyCondition: null as string | null,
    transactionType: initialTransactionType as string,
    sortBy: "createdAt" as string,
    sortOrder: "desc" as string,
  });

  const mapRef = useRef<GoogleMapsRef>(null);

  const handlePropertySelect = (propertyId: string) => {
    const property = properties.find((p) => p._id === propertyId);
    setSelectedProperty(property || null);
  };

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      // Build params object with only set/selected attributes
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };

      // Only add search if it's not empty
      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery;
      }

      // Only add propertyType if it's explicitly set (not null/undefined/empty)
      if (filters.propertyType && filters.propertyType.length > 0 && filters.propertyType[0] && filters.propertyType[0] !== "null") {
        params.propertyType = filters.propertyType[0] as PropertyType;
      }
      
      // Only add transactionType if it's explicitly set
      if (filters.transactionType && filters.transactionType !== "null") {
        params.transactionType = filters.transactionType as TransactionType;
      }

      // Only add price filters if they're not default values
      if (filters.minPrice && filters.minPrice > 0) {
        params.minPrice = filters.minPrice;
      }
      if (filters.maxPrice && filters.maxPrice < 2500000) {
        params.maxPrice = filters.maxPrice;
      }

      // Only add bedroom filters if they're set
      if (filters.minBedrooms !== null && filters.minBedrooms !== undefined) {
        params.minBedrooms = filters.minBedrooms;
      }
      if (filters.maxBedrooms !== null && filters.maxBedrooms !== undefined) {
        params.maxBedrooms = filters.maxBedrooms;
      }

      // Only add bathroom filters if they're set
      if (filters.minBathrooms !== null && filters.minBathrooms !== undefined) {
        params.minBathrooms = filters.minBathrooms;
      }
      if (filters.maxBathrooms !== null && filters.maxBathrooms !== undefined) {
        params.maxBathrooms = filters.maxBathrooms;
      }

      // Only add boolean filters if they're true
      if (filters.isFeatured) params.isFeatured = filters.isFeatured;
      if (filters.isHotProduct) params.isHotProduct = filters.isHotProduct;
      if (filters.isVerified) params.isVerified = filters.isVerified;
      if (filters.isUrgentSale) params.isUrgentSale = filters.isUrgentSale;
      if (filters.isFurnished) params.isFurnished = filters.isFurnished;
      if (filters.hasParking) params.hasParking = filters.hasParking;
      if (filters.isNewConstruction)
        params.isNewConstruction = filters.isNewConstruction;
      if (filters.isReadyToMove) params.isReadyToMove = filters.isReadyToMove;

      // Only add other filters if they're set
      if (filters.furnishingType)
        params.furnishingType = filters.furnishingType;
      if (filters.amenities && filters.amenities.length > 0) {
        params.amenities = filters.amenities.join(",");
      }
      if (filters.minLotSize !== null && filters.minLotSize !== undefined) {
        params.minLotSize = filters.minLotSize.toString();
      }
      if (filters.maxLotSize !== null && filters.maxLotSize !== undefined) {
        params.maxLotSize = filters.maxLotSize.toString();
      }
      if (
        filters.minFloorNumber !== null &&
        filters.minFloorNumber !== undefined
      ) {
        params.minFloorNumber = filters.minFloorNumber;
      }
      if (
        filters.maxFloorNumber !== null &&
        filters.maxFloorNumber !== undefined
      ) {
        params.maxFloorNumber = filters.maxFloorNumber;
      }
      if (
        filters.minTotalFloors !== null &&
        filters.minTotalFloors !== undefined
      ) {
        params.minTotalFloors = filters.minTotalFloors;
      }
      if (
        filters.maxTotalFloors !== null &&
        filters.maxTotalFloors !== undefined
      ) {
        params.maxTotalFloors = filters.maxTotalFloors;
      }
      if (filters.constructionStatus)
        params.constructionStatus = filters.constructionStatus;
      if (filters.minYearBuilt !== null && filters.minYearBuilt !== undefined) {
        params.minYearBuilt = filters.minYearBuilt;
      }
      if (filters.maxYearBuilt !== null && filters.maxYearBuilt !== undefined) {
        params.maxYearBuilt = filters.maxYearBuilt;
      }
      if (filters.facingDirection)
        params.facingDirection = filters.facingDirection;
      if (filters.propertyCondition)
        params.propertyCondition = filters.propertyCondition;

      // Always include sorting
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;

      const response = await propertiesService.getProperties(params);
      console.log("response", response);
      setProperties(response.data.data);
      setPagination((prev) => ({ ...prev, total: response.data.total }));
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      // Handle error state in UI
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  console.log("properties", properties);

  const handleClosePropertyOverlay = () => {
    setSelectedProperty(null);
  };

  const getViewModeClasses = () => {
    switch (viewMode) {
      case "map":
        return "grid-cols-1";
      case "list":
        return "grid-cols-1";
      case "split":
      default:
        return showPropertyList ? "grid-cols-1 lg:grid-cols-5" : "grid-cols-1";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Enhanced Top Search Bar */}
      <div className="border-b bg-white/95 backdrop-blur-sm z-50 p-4">
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by location, area, property name, or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Map Type Toggle */}
          {/* <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-lg p-2">
            <Label htmlFor="google-maps" className="text-sm whitespace-nowrap">
              Google Maps
            </Label>
            <Switch id="google-maps" checked={useGoogleMaps} onCheckedChange={setUseGoogleMaps} />
          </div> */}

          {/* View Mode Toggle */}
          <div className="hidden md:flex border rounded-lg p-1">
            <Button
              variant={viewMode === "map" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("map")}
              className="rounded-md cursor-pointer"
            >
              <MapIcon className="h-4 w-4 mr-2" />
              Map
            </Button>
            <Button
              variant={viewMode === "split" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("split")}
              className="rounded-md cursor-pointer"
            >
              Split
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-md cursor-pointer"
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>

          {/* Advanced Filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-12 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(filters.propertyType.length < 5 ||
                  filters.isVerified ||
                  filters.isUrgentSale ||
                  filters.minBedrooms ||
                  filters.minBathrooms) && (
                  <Badge variant="secondary" className="ml-2">
                    Active
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-96">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Advanced Filters
                </SheetTitle>
              </SheetHeader>
              <AdvancedMapFilters
                filters={filters}
                onFiltersChange={setFilters}
              />
            </SheetContent>
          </Sheet>

          {/* Mobile View Toggle */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden h-12 w-12 bg-transparent"
            onClick={() => setShowPropertyList(!showPropertyList)}
          >
            {showPropertyList ? (
              <SidebarRight className="h-4 w-4" />
            ) : (
              <SidebarLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <Select
            value={filters.transactionType}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, transactionType: value }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="For Sale/Rent" />
            </SelectTrigger>
            <SelectContent>
              {TRANSACTION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  For {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filters.propertyType[0] || ""}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, propertyType: [value] }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 grid ${getViewModeClasses()} transition-all duration-300`}
      >
        {/* Map Section */}
        {(viewMode === "map" || viewMode === "split") && (
          <div
            className={`relative ${
              viewMode === "split" ? "lg:col-span-3" : ""
            }`}
          >
            {useGoogleMaps ? (
              <GoogleMapsIntegration
                ref={mapRef}
                onPropertySelect={handlePropertySelect}
                properties={properties}
              />
            ) : (
              <PerfectMapSearch
                onPropertySelect={handlePropertySelect}
                searchQuery={searchQuery}
                filters={filters}
                compact={viewMode === "split"}
              />
            )}

            {/* Property Detail Overlay */}
            <Dialog
              open={!!selectedProperty}
              onOpenChange={handleClosePropertyOverlay}
            >
              <DialogContent className="p-0 max-w-3xl h-[90vh]">
                {selectedProperty && (
                  <MapResultOverlay
                    property={selectedProperty}
                    onClose={handleClosePropertyOverlay}
                  />
                )}
              </DialogContent>
            </Dialog>

            {/* Map Controls Overlay */}
            <div className="absolute top-4 right-4 z-40">
              <Button
                variant="secondary"
                size="icon"
                className="bg-white/90 hover:bg-white shadow-lg"
                onClick={() => {
                  mapRef.current?.centerOnUserLocation();
                }}
              >
                <Target className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Property List Section */}
        {(viewMode === "list" ||
          (viewMode === "split" && showPropertyList)) && (
          <div
            className={`border-l bg-white lg:col-span-2 ${
              viewMode === "list" ? "" : "hidden lg:block"
            }`}
          >
            <MapPropertyList
              properties={properties}
              loading={loading}
              pagination={pagination}
              onPageChange={(page) =>
                setPagination((prev) => ({ ...prev, page }))
              }
              onPropertySelect={handlePropertySelect}
              selectedProperty={selectedProperty?._id || ""}
            />
          </div>
        )}
      </div>

      {/* Mobile Property List Overlay */}
      {showPropertyList && viewMode === "split" && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-lg">Properties</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPropertyList(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <MapPropertyList
            properties={properties}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
            onPropertySelect={handlePropertySelect}
            selectedProperty={selectedProperty?._id || ""}
          />
        </div>
      )}
    </div>
  );
}
