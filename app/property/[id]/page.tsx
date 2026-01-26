"use client"

import { PropertyDetailsPage } from "@/components/property/property-details-page"
import { useParams } from "next/navigation"

interface PropertyPageProps {
  params: {
    id: string
  }
}

export default function PropertyPage() {
  const params = useParams()
  const propertyId = params.id as string
  return (
    <div className="min-h-screen bg-background">
      <PropertyDetailsPage propertyId={propertyId} />
    </div>
  )
}
