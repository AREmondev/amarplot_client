"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Bookmark, Eye, Pin, Lock, MoreVertical, ThumbsUp, Share2, Flag } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"

interface PostCardProps {
  post: any
  onReaction: (postId: number, reactionType: string) => void
  onClick: () => void
  currentUser: any
  userRole: string | null
}

export default function PostCard({ post, onReaction, onClick, currentUser, userRole }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleReactionClick = (e: React.MouseEvent, reactionType: string) => {
    e.stopPropagation()
    onReaction(post.id, reactionType)
  }

  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-500 text-white"
      case "moderator":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const canModerate = userRole === "admin" || userRole === "moderator" || post.author.id === currentUser.id

  return (
    <Card className="hover:shadow-md transition-all duration-200 cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold truncate">{post.author.name}</h4>
                {post.author.verified && (
                  <Badge variant="secondary" className="text-xs">
                    ✓
                  </Badge>
                )}
                <Badge className={`text-xs ${getRoleColor(post.author.role)}`}>{post.author.role}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formatTimeAgo(post.createdAt)}</span>
                {post.updatedAt !== post.createdAt && <span>• edited</span>}
                <Badge variant="outline" className="text-xs">
                  {post.category}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {post.isPinned && <Pin className="h-4 w-4 text-primary" />}
            {post.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Post
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2" />
                  Report Post
                </DropdownMenuItem>
                {canModerate && (
                  <>
                    <DropdownMenuItem>Edit Post</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete Post</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Post Title */}
        <h3 className="text-lg font-semibold mb-3 line-clamp-2">{post.title}</h3>

        {/* Post Content */}
        <div className="mb-4">
          <p className={`text-muted-foreground ${isExpanded ? "" : "line-clamp-3"}`}>{post.content}</p>
          {post.content.length > 200 && (
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-primary"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
            >
              {isExpanded ? "Show less" : "Read more"}
            </Button>
          )}
        </div>

        {/* Post Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Post Stats */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {post.comments}
            </div>
          </div>

          {/* Reaction Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant={post.userReaction === "like" ? "default" : "ghost"}
              size="sm"
              onClick={(e) => handleReactionClick(e, "like")}
              className="flex items-center gap-1"
            >
              <ThumbsUp className="h-4 w-4" />
              {post.reactions.like}
            </Button>

            <Button
              variant={post.userReaction === "heart" ? "default" : "ghost"}
              size="sm"
              onClick={(e) => handleReactionClick(e, "heart")}
              className="flex items-center gap-1"
            >
              <Heart className="h-4 w-4" />
              {post.reactions.heart}
            </Button>

            <Button
              variant={post.userReaction === "bookmark" ? "default" : "ghost"}
              size="sm"
              onClick={(e) => handleReactionClick(e, "bookmark")}
              className="flex items-center gap-1"
            >
              <Bookmark className="h-4 w-4" />
              {post.reactions.bookmark}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
