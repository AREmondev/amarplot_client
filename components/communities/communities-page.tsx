"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Users,
  MessageCircle,
  MapPin,
  ArrowRight,
  Search,
  Filter,
  Star,
  TrendingUp,
  Calendar,
  Sparkles,
  SlidersHorizontal,
  Grid3X3,
  List,
  Plus,
} from "lucide-react"
import Image from "next/image"
import { useUserProfile } from "@/hooks/use-user-profile"
import { getRelevantCommunities, getCommunityRecommendationReason } from "@/utils/community-matcher"

const allCommunities = [
  {
    id: 1,
    name: "Gulshan Property Owners",
    location: "Gulshan, Dhaka",
    members: 1250,
    posts: 89,
    image: "/placeholder.svg?height=100&width=100",
    description: "Connect with property owners and investors in Gulshan area for premium real estate opportunities",
    tags: ["Premium", "Investment", "Luxury"],
    category: "Investment",
    targetAudience: ["businessman", "investor", "job_holder"],
    priceRange: { min: 5000000, max: 50000000 },
    propertyTypes: ["flat", "plot"],
    rating: 4.8,
    growth: "+12%",
    lastActivity: "2 hours ago",
    featured: true,
    relevanceScore: 0.9,
  },
  {
    id: 2,
    name: "Student Housing Dhaka",
    location: "University Area, Dhaka",
    members: 2100,
    posts: 156,
    image: "/placeholder.svg?height=100&width=100",
    description: "Find and share student accommodation options near universities with fellow students",
    tags: ["Students", "Affordable", "University"],
    category: "Student",
    targetAudience: ["student"],
    priceRange: { min: 5000, max: 25000 },
    propertyTypes: ["mess", "flat"],
    rating: 4.6,
    growth: "+25%",
    lastActivity: "1 hour ago",
    featured: false,
    relevanceScore: 0.8,
  },
  {
    id: 3,
    name: "Land Investors BD",
    location: "Nationwide",
    members: 850,
    posts: 67,
    image: "/placeholder.svg?height=100&width=100",
    description: "Agricultural and commercial land investment discussions with experienced investors",
    tags: ["Investment", "Land", "Agriculture"],
    category: "Investment",
    targetAudience: ["businessman", "investor"],
    priceRange: { min: 1000000, max: 20000000 },
    propertyTypes: ["land"],
    rating: 4.7,
    growth: "+8%",
    lastActivity: "3 hours ago",
    featured: false,
    relevanceScore: 0.7,
  },
  {
    id: 4,
    name: "Dhaka Professionals Network",
    location: "Dhaka",
    members: 1800,
    posts: 234,
    image: "/placeholder.svg?height=100&width=100",
    description: "Working professionals sharing apartment hunting tips and residential property insights",
    tags: ["Professionals", "Residential", "Networking"],
    category: "Professional",
    targetAudience: ["job_holder"],
    priceRange: { min: 1500000, max: 8000000 },
    propertyTypes: ["flat"],
    rating: 4.9,
    growth: "+20%",
    lastActivity: "30 minutes ago",
    featured: true,
    relevanceScore: 0.95,
  },
  {
    id: 5,
    name: "Young Entrepreneurs Hub",
    location: "Dhaka",
    members: 680,
    posts: 145,
    image: "/placeholder.svg?height=100&width=100",
    description: "Business owners and entrepreneurs discussing commercial properties and investment opportunities",
    tags: ["Business", "Commercial", "Entrepreneurs"],
    category: "Business",
    targetAudience: ["businessman"],
    priceRange: { min: 3000000, max: 25000000 },
    propertyTypes: ["plot", "land"],
    rating: 4.5,
    growth: "+18%",
    lastActivity: "4 hours ago",
    featured: false,
    relevanceScore: 0.6,
  },
  {
    id: 6,
    name: "Chittagong Real Estate",
    location: "Chittagong",
    members: 950,
    posts: 78,
    image: "/placeholder.svg?height=100&width=100",
    description: "Local real estate community for Chittagong region with market insights and opportunities",
    tags: ["Regional", "Growing", "Local"],
    category: "Regional",
    targetAudience: ["job_holder", "businessman", "investor"],
    priceRange: { min: 800000, max: 12000000 },
    propertyTypes: ["flat", "plot", "land"],
    rating: 4.4,
    growth: "+15%",
    lastActivity: "5 hours ago",
    featured: false,
    relevanceScore: 0.5,
  },
  {
    id: 7,
    name: "Sylhet Property Circle",
    location: "Sylhet",
    members: 420,
    posts: 34,
    image: "/placeholder.svg?height=100&width=100",
    description: "Sylhet-based property community for local real estate discussions and opportunities",
    tags: ["Regional", "Tea Gardens", "Tourism"],
    category: "Regional",
    targetAudience: ["job_holder", "businessman"],
    priceRange: { min: 500000, max: 8000000 },
    propertyTypes: ["flat", "land"],
    rating: 4.3,
    growth: "+22%",
    lastActivity: "6 hours ago",
    featured: false,
    relevanceScore: 0.4,
  },
  {
    id: 8,
    name: "First Time Buyers Club",
    location: "Nationwide",
    members: 1650,
    posts: 189,
    image: "/placeholder.svg?height=100&width=100",
    description: "Support group for first-time property buyers with guides, tips, and shared experiences",
    tags: ["Beginners", "Support", "Education"],
    category: "Educational",
    targetAudience: ["student", "job_holder"],
    priceRange: { min: 500000, max: 5000000 },
    propertyTypes: ["flat"],
    rating: 4.7,
    growth: "+30%",
    lastActivity: "1 hour ago",
    featured: true,
    relevanceScore: 0.85,
  },
]

import { CITIES, COMMUNITY_CATEGORIES, USER_TYPES, COMMUNITY_SORT_OPTIONS } from "@/lib/constants"

const locations = ["All Locations", ...CITIES.map(city => city.label)]
const categories = ["All Categories", ...COMMUNITY_CATEGORIES.map(cat => cat.label)]
const userTypes = ["All Types", ...USER_TYPES.map(type => type.label)]

export default function CommunitiesPage() {
  const router = useRouter()
  const userProfileData = useUserProfile()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedUserType, setSelectedUserType] = useState("All Types")
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allTags = Array.from(new Set(allCommunities.flatMap((c) => c.tags)))

  const filteredCommunities = allCommunities
    .filter((community) => {
      const matchesSearch =
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesLocation = selectedLocation === "All Locations" || community.location.includes(selectedLocation)
      const matchesCategory = selectedCategory === "All Categories" || community.category === selectedCategory
      const matchesUserType = selectedUserType === "All Types" || community.targetAudience.includes(selectedUserType)
      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => community.tags.includes(tag))

      return matchesSearch && matchesLocation && matchesCategory && matchesUserType && matchesTags
    })
    .sort((a, b) => {
      if (sortBy === "relevance" && userProfile) {
        const relevantCommunities = getRelevantCommunities([a, b], userProfile)
        return (relevantCommunities[0].relevanceScore || 0) - (relevantCommunities[1].relevanceScore || 0)
      }

      switch (sortBy) {
        case "members":
          return b.members - a.members
        case "posts":
          return b.posts - a.posts
        case "rating":
          return b.rating - a.rating
        case "growth":
          return Number.parseFloat(b.growth) - Number.parseFloat(a.growth)
        case "newest":
          return b.id - a.id
        default:
          return 0
      }
    })

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedLocation("All Locations")
    setSelectedCategory("All Categories")
    setSelectedUserType("All Types")
    setSelectedTags([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Discover Communities</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Join property communities tailored to your interests, location, and goals. Connect with like-minded
            individuals and grow your real estate network.
          </p>
        </div>

        {/* Search and Quick Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search communities, descriptions, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {(selectedLocation !== "All Locations" ||
                  selectedCategory !== "All Categories" ||
                  selectedUserType !== "All Types" ||
                  selectedTags.length > 0) && (
                  <Badge variant="secondary" className="ml-1">
                    {[
                      selectedLocation !== "All Locations" ? 1 : 0,
                      selectedCategory !== "All Categories" ? 1 : 0,
                      selectedUserType !== "All Types" ? 1 : 0,
                      selectedTags.length,
                    ].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Target Audience</label>
                    <Select value={selectedUserType} onValueChange={setSelectedUserType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {userTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type === "All Types"
                              ? type
                              : type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={tag}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={() => handleTagToggle(tag)}
                        />
                        <label htmlFor={tag} className="text-sm">
                          {tag}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              {filteredCommunities.length} Communities Found
              {userProfile && sortBy === "relevance" && " (Personalized for you)"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {userProfile
                ? `Showing results for ${userProfile.userType.replace("_", " ")} in ${userProfile.location}`
                : "Discover communities that match your interests"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {userProfile && <SelectItem value="relevance">Most Relevant</SelectItem>}
                <SelectItem value="members">Most Members</SelectItem>
                <SelectItem value="posts">Most Active</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="growth">Fastest Growing</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Communities Grid/List */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredCommunities.map((community) => {
            const recommendationReason = getCommunityRecommendationReason(community, userProfile)
            const isHighlyRelevant = userProfile && (community.relevanceScore || 0) > 50

            return (
              <Card
                key={community.id}
                className={`group hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  community.featured || isHighlyRelevant
                    ? "ring-2 ring-primary/20 bg-gradient-to-br from-white to-primary/5"
                    : "bg-white"
                } ${viewMode === "list" ? "flex flex-row" : ""}`}
              >
                <CardContent className={`p-6 ${viewMode === "list" ? "flex-1 flex items-center gap-6" : ""}`}>
                  {/* Community Image and Basic Info */}
                  <div className={`flex items-start gap-4 ${viewMode === "list" ? "flex-shrink-0" : "mb-4"}`}>
                    <div className="relative">
                      <Image
                        src={community.image || "/placeholder.svg"}
                        alt={community.name}
                        width={viewMode === "list" ? 80 : 60}
                        height={viewMode === "list" ? 80 : 60}
                        className="rounded-full border-2 border-primary/20"
                      />
                      {(community.featured || isHighlyRelevant) && (
                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                          <Star className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg line-clamp-1 mb-1">{community.name}</h3>
                      <div className="flex items-center text-muted-foreground text-sm mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        {community.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs font-medium ml-1">{community.rating}</span>
                        </div>
                        <div className="flex items-center text-green-600 text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {community.growth}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={viewMode === "list" ? "flex-1" : ""}>
                    {/* Recommendation Reason */}
                    {recommendationReason && (
                      <div className="mb-3 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                        <div className="flex items-center gap-1 text-xs text-primary font-medium">
                          <Sparkles className="h-3 w-3" />
                          {recommendationReason}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{community.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {community.tags.slice(0, viewMode === "list" ? 4 : 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div
                      className={`${
                        viewMode === "list" ? "flex items-center gap-6" : "grid grid-cols-2 gap-4"
                      } mb-4 p-3 bg-muted/30 rounded-lg`}
                    >
                      <div className="text-center">
                        <div className="flex items-center justify-center text-primary mb-1">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="font-semibold">{community.members.toLocaleString()}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Members</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center text-accent mb-1">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span className="font-semibold">{community.posts}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Posts</div>
                      </div>
                    </div>

                    {/* Last Activity */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Last activity: {community.lastActivity}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className={`${
                      viewMode === "list" ? "flex-shrink-0" : "w-full"
                    } group-hover:bg-primary group-hover:text-primary-foreground bg-transparent transition-all duration-300`}
                    variant="outline"
                  >
                    Join Community
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* No Results */}
        {filteredCommunities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No communities found</p>
              <p className="text-sm">Try adjusting your search criteria or filters</p>
            </div>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Create Community CTA */}
        <Card className="mt-12 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Can&apos;t find the right community?</h3>
            <p className="text-muted-foreground mb-4">
              Create your own community and bring together people with similar property interests.
            </p>
            <Button onClick={() => router.push('/communities/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Community
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
