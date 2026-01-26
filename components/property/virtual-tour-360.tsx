"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Maximize, Volume2 } from "lucide-react"

interface VirtualTour360Props {
  tourUrl: string
}

export function VirtualTour360({ tourUrl }: VirtualTour360Props) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 h-96 rounded-lg overflow-hidden">
          {/* Virtual Tour Placeholder */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">360° Virtual Tour</h3>
              <p className="text-muted-foreground text-sm">Experience this property in immersive 360° view</p>
            </div>
          </div>

          {/* Controls Overlay */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur rounded-full px-4 py-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                <Volume2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
