"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Heart,
  MessageCircle,
  Bookmark,
  Eye,
  Pin,
  Lock,
  MoreVertical,
  ThumbsUp,
  Share2,
  Flag,
  Send,
  Reply,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"

// Mock comments data
const mockComments = [
  {
    id: 1,
    content: "Great analysis! I've been looking at similar opportunities in the area.",
    author: {
      id: 2,
      name: "Karim Hassan",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Moderator",
      verified: true,
    },
    createdAt: "2024-01-15T11:30:00Z",
    likes: 5,
    replies: [
      {
        id: 11,
        content: "Thanks! Would love to discuss this further.",
        author: {
          id: 1,
          name: "Sarah Ahmed",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "Admin",
          verified: true,
        },
        createdAt: "2024-01-15T12:00:00Z",
        likes: 2,
        userReaction: null,
      },
    ],
    userReaction: "like",
  },
  {
    id: 2,
    content:
      "This is exactly what I was looking for. Do you have any specific recommendations for first-time investors?",
    author: {
      id: 3,
      name: "Fatima Khan",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Member",
      verified: false,
    },
    createdAt: "2024-01-15T13:45:00Z",
    likes: 3,
    replies: [],
    userReaction: null,
  },
]

interface PostDetailsModalProps {
  post: any
  onClose: () => void
  onReaction: (postId: number, reactionType: string) => void
  currentUser: any
  userRole: string | null
}

export default function PostDetailsModal({ post, onClose, onReaction, currentUser, userRole }: PostDetailsModalProps) {
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const handleReactionClick = (reactionType: string) => {
    onReaction(post.id, reactionType)
  }

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return

    const comment = {
      id: comments.length + 1,
      content: newComment.trim(),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: userRole || "Member",
        verified: false,
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
      userReaction: null,
    }

    setComments([...comments, comment])
    setNewComment("")
  }

  const handleReplySubmit = (commentId: number) => {
    if (!replyContent.trim()) return

    const reply = {
      id: Date.now(),
      content: replyContent.trim(),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: userRole || "Member",
        verified: false,
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      userReaction: null,
    }

    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
      ),
    )
    setReplyContent("")
    setReplyingTo(null)
  }

  const handleCommentReaction = (commentId: number, reactionType: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          const currentReaction = comment.userReaction
          const newReaction = currentReaction === reactionType ? null : reactionType

          return {
            ...comment,
            userReaction: newReaction,
            likes:
              reactionType === "like"
                ? currentReaction === "like"
                  ? comment.likes - 1
                  : comment.likes + 1
                : comment.likes,
          }
        }
        return comment
      }),
    )
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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Post Details */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{post.author.name}</h4>
                  {post.author.verified && (
                    <Badge variant="secondary" className="text-xs">
                      ✓
                    </Badge>
                  )}
                  <Badge className={`text-xs ${getRoleColor(post.author.role)}`}>{post.author.role}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatTimeAgo(post.createdAt)}</span>
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
                <DropdownMenuTrigger asChild>
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <div className="prose max-w-none mb-6">
            <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Post Stats and Reactions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.views} views
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {comments.length} comments
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={post.userReaction === "like" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleReactionClick("like")}
                className="flex items-center gap-1"
              >
                <ThumbsUp className="h-4 w-4" />
                {post.reactions.like}
              </Button>

              <Button
                variant={post.userReaction === "heart" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleReactionClick("heart")}
                className="flex items-center gap-1"
              >
                <Heart className="h-4 w-4" />
                {post.reactions.heart}
              </Button>

              <Button
                variant={post.userReaction === "bookmark" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleReactionClick("bookmark")}
                className="flex items-center gap-1"
              >
                <Bookmark className="h-4 w-4" />
                {post.reactions.bookmark}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Add Comment */}
          <div className="space-y-3">
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-end">
              <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Comment
              </Button>
            </div>
          </div>

          <Separator />

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-4">
                {/* Comment */}
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{comment.author.name}</span>
                      {comment.author.verified && (
                        <Badge variant="secondary" className="text-xs">
                          ✓
                        </Badge>
                      )}
                      <Badge className={`text-xs ${getRoleColor(comment.author.role)}`}>{comment.author.role}</Badge>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.createdAt)}</span>
                    </div>

                    <p className="text-sm">{comment.content}</p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={comment.userReaction === "like" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleCommentReaction(comment.id, "like")}
                        className="h-7 px-2 text-xs"
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {comment.likes}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="h-7 px-2 text-xs"
                      >
                        <Reply className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="space-y-2 mt-3">
                        <Textarea
                          placeholder="Write a reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          rows={2}
                          className="resize-none text-sm"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleReplySubmit(comment.id)}
                            disabled={!replyContent.trim()}
                          >
                            Reply
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-11 space-y-4 border-l-2 border-muted pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{reply.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs">{reply.author.name}</span>
                            {reply.author.verified && (
                              <Badge variant="secondary" className="text-xs">
                                ✓
                              </Badge>
                            )}
                            <Badge className={`text-xs ${getRoleColor(reply.author.role)}`}>{reply.author.role}</Badge>
                            <span className="text-xs text-muted-foreground">{formatTimeAgo(reply.createdAt)}</span>
                          </div>

                          <p className="text-xs">{reply.content}</p>

                          <Button
                            variant={reply.userReaction === "like" ? "default" : "ghost"}
                            size="sm"
                            className="h-6 px-2 text-xs"
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {reply.likes}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
