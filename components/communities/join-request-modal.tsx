"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Shield, AlertCircle } from "lucide-react"
import Image from "next/image"

interface JoinRequestModalProps {
  community: any
  onSubmit: (requestData: any) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export default function JoinRequestModal({ community, onSubmit, onCancel, isLoading }: JoinRequestModalProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      communityId: community.id,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Image
            src={community.image || "/placeholder.svg"}
            alt={community.name}
            width={80}
            height={80}
            className="rounded-full border-2 border-border"
          />
        </div>
        <CardTitle className="text-xl">{community.requiresApproval ? "Request to Join" : "Join Community"}</CardTitle>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{community.name}</h3>
          <div className="flex items-center justify-center text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            {community.location}
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {community.members.toLocaleString()} members
            </div>
            {community.isPrivate && (
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Private
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {community.requiresApproval && (
            <div className="space-y-2">
              <Label htmlFor="message">Why do you want to join this community?</Label>
              <Textarea
                id="message"
                placeholder="Tell the moderators why you&apos;d like to join this community..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                This message will be sent to community moderators for review.
              </p>
            </div>
          )}

          {community.requiresApproval && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Approval Required</p>
                <p>Your request will be reviewed by community moderators. You&apos;ll be notified once it&apos;s approved.</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Processing..." : community.requiresApproval ? "Send Request" : "Join Community"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
