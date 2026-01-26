"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash2, Eye, MoreHorizontal, MapPin, Calendar, TrendingUp, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Property } from "@/types"

interface MyListingsProps {
  properties: Property[]
  onDelete: (id: string) => void
  onEdit: (property: Property) => void
}

export function MyListings({ properties, onDelete, onEdit }: MyListingsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Get unique locations for filter
  const locations = Array.from(new Set(properties.map((p) => p.location.address.split(",")[0].trim())))

  // Filter and sort properties
  const filterProperties = (status?: string) => {
    let filtered = properties

    // Filter by status if provided
    if (status) {
      filtered = filtered.filter((p) => p.status === status)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by location
    if (locationFilter !== "all") {
      filtered = filtered.filter((p) => p.location.address.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    // Sort properties
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "price":
        filtered.sort((a, b) => {
          const priceA = Number.parseInt(a.price.replace(/[^\d]/g, ""))
          const priceB = Number.parseInt(b.price.replace(/[^\d]/g, ""))
          return priceB - priceA
        })
        break
    }

    return filtered
  }

  const publishedProperties = filterProperties("published")
  const pendingProperties = filterProperties("pending")
  const draftProperties = filterProperties("draft")
  const allProperties = filterProperties()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "pending":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const PropertyCard = ({ property }: { property: Property }) => (
    <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-200">
      <CardContent className="p-0">
        {/* Property Image */}
        <div className="relative">
          <img
            src={property.images[0] || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-4 left-4">
            <Badge className={getStatusColor(property.status)}>{property.status}</Badge>
          </div>
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(property)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(property.id)} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
            <p className="text-xl font-bold text-blue-600 mb-2">{property.price}</p>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{property.location.address}</span>
            </div>
            <p className="text-gray-700 text-sm line-clamp-2">{property.description}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>234 views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(property.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>Active</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => onEdit(property)} className="flex-1">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(property.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const PropertyGrid = ({ properties }: { properties: Property[] }) => (
    <>
      {properties.length === 0 ? (
        <Card className="border-0 shadow-sm col-span-full">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Eye className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-600 mt-1">
            {properties.length} {properties.length === 1 ? "property" : "properties"} listed
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by title, location, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>

            {/* Location Filter */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location.toLowerCase()}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price">Price High-Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <span>All</span>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              {allProperties.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="published" className="flex items-center space-x-2">
            <span>Published</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {publishedProperties.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <span>Pending</span>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              {pendingProperties.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex items-center space-x-2">
            <span>Draft</span>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              {draftProperties.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <PropertyGrid properties={allProperties} />
        </TabsContent>

        <TabsContent value="published" className="space-y-6">
          <PropertyGrid properties={publishedProperties} />
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <PropertyGrid properties={pendingProperties} />
        </TabsContent>

        <TabsContent value="draft" className="space-y-6">
          <PropertyGrid properties={draftProperties} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
