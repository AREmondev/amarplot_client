"use client"

import { PerfectMapSearch } from "./perfect-map-search"

interface MapWithDrawProps {
  onPropertySelect: (propertyId: string) => void
}

export function MapWithDraw({ onPropertySelect }: MapWithDrawProps) {
  return <PerfectMapSearch onPropertySelect={onPropertySelect} />
}
