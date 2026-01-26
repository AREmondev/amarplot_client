"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Users,
  Search,
  Calendar,
  Crown,
  Shield,
  User,
  LogOut,
  UserPlus,
  MessageSquare,
  Heart,
  Clock,
  MapPin,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast";

interface Community {
  id: string
  name: string
  description: string
  image: string
  memberCount: number
  type: "public" | "private"
  category: string
  location: string
  joinedDate: string
  userRole: "admin" | "moderator" | "member"
  isActive: boolean
  lastActivity: string
  stats: {
    posts: number
    comments: number
    likes: number
  }
}

const mockJoinedCommunities: Community[] = [
  {
    id: "1",
    name: "Dhaka Property Investors",
    description: "Connect with serious property investors in Dhaka",
    image: "/placeholder.svg?height=60&width=60",
    memberCount: 1247,
    type: "private",
    category: "Investment",
    location: "Dhaka",
    joinedDate: "2024-01-15",
    userRole: "member",
    isActive: true,
    lastActivity: "2 hours ago",
    stats: { posts: 12, comments: 45, likes: 89 },
  },
  {
    id: "2",
    name: "Gulshan Residents",
    description: "Community for Gulshan area residents and property seekers",
    image: "/placeholder.svg?height=60&width=60",
    memberCount: 892,
    type: "public",
    category: "Residential",
    location: "Gulshan, Dhaka",
    joinedDate: "2024-02-20",
    userRole: "moderator",
    isActive: true,
    lastActivity: "1 day ago",
    stats: { posts: 8, comments: 23, likes: 56 },
  },
  {
    id: "3",
    name: "First Time Home Buyers",
    description: "Support group for first-time property buyers",
    image: "/placeholder.svg?height=60&width=60",
    memberCount: 2156,
    type: "public",
    category: "Support",
    location: "Bangladesh",
    joinedDate: "2023-11-10",
    userRole: "admin",
    isActive: false,
    lastActivity: "1 week ago",
    stats: { posts: 25, comments: 78, likes: 134 },
  },
  {
    id: "4",
    name: "Commercial Property Hub",
    description: "Discuss commercial real estate opportunities",
    image: "/placeholder.svg?height=60&width=60",
    memberCount: 567,
    type: "private",
    category: "Commercial",
    location: "Dhaka",
    joinedDate: "2024-03-05",
    userRole: "member",
    isActive: true,
    lastActivity: "3 days ago",
    stats: { posts: 5, comments: 15, likes: 28 },
  },
]

export default function MyCommunities() {
  const [communities, setCommunities] = useState<Community[]>(mockJoinedCommunities)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all")
  const { toast } = useToast()

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filter === "all" || (filter === "active" && community.isActive) || (filter === "inactive" && !community.isActive)
    return matchesSearch && matchesFilter
  })

  const handleLeaveCommunity = (communityId: string, communityName: string) => {
    setCommunities((prev) => prev.filter((c) => c.id !== communityId))
    toast({
      title: "Left Community",
      description: `You have left ${communityName}`,
    })
  }

  const handleRejoinCommunity = (communityId: string, communityName: string) => {
    setCommunities((prev) => prev.map((c) => (c.id === communityId ? { ...c, isActive: true } : c)))
    toast({
      title: "Rejoined Community",
      description: `You have rejoined ${communityName}`,
    })
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "moderator":
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-yellow-500 text-white">Admin</Badge>
      case "moderator":
        return <Badge className="bg-blue-500 text-white">Moderator</Badge>
      default:
        return <Badge variant="outline">Member</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">My Communities</h2>
          <p className="text-muted-foreground">Manage your community memberships and activity</p>
        </div>
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All ({communities.length})
          </Button>
          <Button variant={filter === "active" ? "default" : "outline"} size="sm" onClick={() => setFilter("active")}>
            Active ({communities.filter((c) => c.isActive).length})
          </Button>
          <Button
            variant={filter === "inactive" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("inactive")}
          >
            Left ({communities.filter((c) => !c.isActive).length})
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Communities Grid */}
      <div className="grid gap-4">
        {filteredCommunities.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No communities found</h3>
              <p className="text-muted-foreground text-center">
                {searchQuery ? "Try adjusting your search terms" : "You haven't joined any communities yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCommunities.map((community) => (
            <Card key={community.id} className={`transition-all ${!community.isActive ? "opacity-60" : ""}`}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Community Info */}
                  <div className="flex gap-4 flex-1">
                    <Avatar className="h-16 w-16 flex-shrink-0">
                      <AvatarImage src={community.image || "/placeholder.svg"} />
                      <AvatarFallback>
                        {community.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <h3 className="font-semibold text-lg truncate">{community.name}</h3>
                        {getRoleBadge(community.userRole)}
                        <Badge variant={community.type === "private" ? "secondary" : "outline"}>{community.type}</Badge>
                      </div>

                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{community.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {community.memberCount.toLocaleString()} members
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {community.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {new Date(community.joinedDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {community.lastActivity}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator orientation="vertical" className="hidden lg:block" />

                  {/* Stats & Actions */}
                  <div className="flex flex-col gap-4 lg:w-64">
                    {/* Activity Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <MessageSquare className="h-3 w-3" />
                          <span className="text-xs font-medium">Posts</span>
                        </div>
                        <div className="text-lg font-bold">{community.stats.posts}</div>
                      </div>
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <MessageSquare className="h-3 w-3" />
                          <span className="text-xs font-medium">Comments</span>
                        </div>
                        <div className="text-lg font-bold">{community.stats.comments}</div>
                      </div>
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Heart className="h-3 w-3" />
                          <span className="text-xs font-medium">Likes</span>
                        </div>
                        <div className="text-lg font-bold">{community.stats.likes}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => (window.location.href = `/communities/${community.id}`)}
                      >
                        View
                      </Button>

                      {community.isActive ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive bg-transparent"
                            >
                              <LogOut className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Leave Community</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to leave &quot;{community.name}&quot;? You&apos;ll lose access to all posts and
                                discussions.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleLeaveCommunity(community.id, community.name)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Leave Community
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejoinCommunity(community.id, community.name)}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
