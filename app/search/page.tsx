"use client"

import Header from "@/components/common/header"
import { MapSearchPage } from "@/components/map/map-search-page"

export default function MapPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}
      <MapSearchPage />
    </div>
  )
}
