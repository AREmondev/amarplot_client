"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Bed, Bath, Square, Trash2, Share2, Search, Eye, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react";
import { profileService } from "@/lib/api/profile";
import { PROPERTY_TYPES, SORT_OPTIONS } from "@/lib/constants";

interface SavedListingsProps {
  savedPropertyIds: string[];
  userId: string; // Assuming userId is needed for API calls
  onRemoveSavedProperty: (propertyId: string) => void;
}

interface Property {
  _id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  area: string;
  image: string;
  savedDate: string; // This will be the date when the user saved it, not the property creation date
  tags: string[];
  notes?: string;
}

export default function SavedListings({ savedPropertyIds, userId, onRemoveSavedProperty }: SavedListingsProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { toast } = useToast();

  useEffect(() => {
    const fetchSavedProperties = async () => {
      if (savedPropertyIds.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }
      const { data: session } = useSession();
      if (!session?.user?.token) {
        setLoading(false);
        return;
      }
      try {
        const data = await profileService.getPropertiesByIds(session.user.token, savedPropertyIds);
        // Add a mock savedDate for now, ideally this would come from the user saved list metadata
        const propertiesWithSavedDate = data.map((p: Property) => ({
          ...p,
          savedDate: new Date().toISOString(), // Placeholder
        }));
        setProperties(propertiesWithSavedDate);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: `Failed to load saved properties: ${err.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, [savedPropertyIds, toast]);

  const filteredProperties = properties
    .filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || property.type.toLowerCase() === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
        case "oldest":
          return new Date(a.savedDate).getTime() - new Date(b.savedDate).getTime();
        case "price-high":
          return Number.parseFloat(b.price.replace(/[₹,]/g, "")) - Number.parseFloat(a.price.replace(/[₹,]/g, ""));
        case "price-low":
          return Number.parseFloat(a.price.replace(/[₹,]/g, "")) - Number.parseFloat(b.price.replace(/[₹,]/g, ""));
        default:
          return 0;
      }
    });

  const handleSelectProperty = (propertyId: string) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId],
    );
  };

  const handleSelectAll = () => {
    if (selectedProperties.length === filteredProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(filteredProperties.map((p) => p._id));
    }
  };

  const handleDeleteSelected = async () => {
    try {
      // Call the parent component's handler to update the user saved properties in the backend
      for (const propertyId of selectedProperties) {
        await onRemoveSavedProperty(propertyId);
      }
      setSelectedProperties([]);
      toast({
        title: "Properties Removed",
        description: `${selectedProperties.length} properties removed from saved list.`,
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to remove selected properties: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await onRemoveSavedProperty(propertyId);
      toast({
        title: "Property Removed",
        description: `Property removed from saved list.`,
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to remove property: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <Card><CardContent className="p-6 text-center">Loading saved properties...</CardContent></Card>;
  }

  if (error) {
    return <Card><CardContent className="p-6 text-center text-red-500">Error: {error}</CardContent></Card>;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">Saved Properties</h2>
            <p className="text-muted-foreground text-sm">
              {filteredProperties.length} of {properties.length} properties
            </p>
          </div>
          <Badge variant="secondary">{properties.length} total saved</Badge>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search saved properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedProperties.length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <span className="text-sm font-medium">{selectedProperties.length} selected</span>
            <Button size="sm" variant="outline" onClick={handleDeleteSelected}>
              <Trash2 className="h-4 w-4 mr-1" />
              Remove Selected
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="h-4 w-4 mr-1" />
              Share Selected
            </Button>
          </div>
        )}

        {/* Select All */}
        {filteredProperties.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Checkbox
              checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">Select all {filteredProperties.length} properties</span>
          </div>
        )}

        {/* Properties List */}
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <Card key={property._id} className="hover:shadow-cardHover transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedProperties.includes(property._id)}
                    onCheckedChange={() => handleSelectProperty(property._id)}
                  />

                  <div className="relative w-32 h-24 flex-shrink-0">
                    <Image
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg truncate pr-2">{property.title}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Property
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteProperty(property._id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove from Saved
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center text-muted-foreground text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.location}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {property.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      {property.bedrooms && (
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          {property.bedrooms}
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {property.bathrooms}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        {property.area}
                      </div>
                    </div>

                    {property.notes && (
                      <p className="text-sm text-muted-foreground italic mb-2">Note: {property.notes}</p>
                    )}

                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xl font-bold text-primary">{property.price}</div>
                        <div className="text-xs text-muted-foreground">Saved {formatDate(property.savedDate)}</div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{property.type}</Badge>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProperties.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No properties found matching "{searchQuery}"</p>
            <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        )}

        {properties.length === 0 && !loading && !error && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No saved properties yet</p>
            <Button className="mt-4">Browse Properties</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

