"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

export function MapLegend() {
  const legendItems = [
    { type: "flat", color: "bg-blue-500", label: "Flats", count: 245 },
    { type: "plot", color: "bg-green-500", label: "Plots", count: 156 },
    { type: "land", color: "bg-yellow-500", label: "Land", count: 89 },
    { type: "mess", color: "bg-purple-500", label: "Mess", count: 34 },
  ]

  const priceRanges = [
    { range: "Under ₹5L", color: "bg-green-200", count: 123 },
    { range: "₹5L - ₹10L", color: "bg-yellow-200", count: 234 },
    { range: "₹10L - ₹20L", color: "bg-orange-200", count: 156 },
    { range: "Above ₹20L", color: "bg-red-200", count: 67 },
  ]

  return (
    <Card className="w-64 bg-white/95 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Map Legend</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Property Types */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Property Types</h4>
          <div className="space-y-2">
            {legendItems.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${item.color} flex items-center justify-center`}>
                    <MapPin className="h-2 w-2 text-white" />
                  </div>
                  <span className="text-xs">{item.label}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Price Ranges */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Price Ranges</h4>
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-2 ${range.color} rounded`} />
                  <span className="text-xs">{range.range}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {range.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Map Info */}
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            Total Properties: <span className="font-medium">580</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Last Updated: <span className="font-medium">2 min ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
