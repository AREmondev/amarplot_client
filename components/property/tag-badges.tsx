"use client"

import { Badge } from "@/components/ui/badge"
import { Verified, TrendingUp, Clock } from "lucide-react"
import type { Property } from "@/types"

interface TagBadgesProps {
  property: Property
}

export function TagBadges({ property }: TagBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {property.isVerified && (
        <Badge className="bg-accent text-accent-foreground">
          <Verified className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      )}
      {property.isUrgent && (
        <Badge variant="destructive">
          <Clock className="h-3 w-3 mr-1" />
          Urgent
        </Badge>
      )}
      {property.isHotDeal && (
        <Badge className="bg-orange-500 text-white">
          <TrendingUp className="h-3 w-3 mr-1" />
          Hot Deal
        </Badge>
      )}
      {property.tags.map((tag) => (
        <Badge key={tag} variant="outline">
          {tag}
        </Badge>
      ))}
    </div>
  )
}
