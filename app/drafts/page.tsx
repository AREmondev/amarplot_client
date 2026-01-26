"use client"
// import DashboardComponent from "@/components/dashboard-page";
import { useState } from "react";
import { DraftData, Property } from "@/types"
import { MyListings } from "@/components/listings/MyListings";
import { Drafts } from "@/components/drafts/DraftPage";
import WithVerification from "@/components/common/with-verification";


export default function Properties() {

  const [currentPage, setCurrentPage] = useState<"dashboard" | "listings" | "drafts" | "post" | "messages">("dashboard")

  const [properties, setProperties] = useState<Property[]>([
    {
      id: "1",
      title: "3BHK Flat near Dhanmondi",
      type: "Flat",
      price: "₹25,000/month",
      description: "Beautiful 3BHK flat with modern amenities, parking space, and 24/7 security.",
      location: {
        address: "Dhanmondi, Dhaka, Bangladesh",
        lat: 23.7461,
        lng: 90.3742,
      },
      images: ["/placeholder.svg?height=300&width=400"],
      status: "published",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Commercial Plot in Gulshan",
      type: "Plot",
      price: "₹50,00,000",
      description: "Prime commercial plot perfect for business development.",
      location: {
        address: "Gulshan, Dhaka, Bangladesh",
        lat: 23.7806,
        lng: 90.4193,
      },
      images: ["/placeholder.svg?height=300&width=400"],
      status: "pending",
      createdAt: "2024-01-14",
      updatedAt: "2024-01-14",
    },
  ])

  const [drafts, setDrafts] = useState<DraftData[]>([
    {
      id: "draft-1",
      step: 2,
      data: {
        title: "Luxury Villa in Uttara",
        type: "House",
        price: "₹75,000/month",
      },
      lastSaved: "2024-01-16T10:30:00Z",
    },
  ])

  const [editingProperty, setEditingProperty] = useState<Property | null>(null)

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property)
    setCurrentPage("post")
  }

  const handleAddProperty = (property: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    if (editingProperty) {
      // Update existing property
      const updatedProperty: Property = {
        ...property,
        id: editingProperty.id,
        createdAt: editingProperty.createdAt,
        updatedAt: new Date().toISOString().split("T")[0],
      }
      setProperties((prev) => prev.map((p) => (p.id === editingProperty.id ? updatedProperty : p)))
      setEditingProperty(null)
    } else {
      // Add new property
      const newProperty: Property = {
        ...property,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }
      setProperties((prev) => [newProperty, ...prev])
    }
    setCurrentPage("listings")
  }

  const handleSaveDraft = (draftData: Omit<DraftData, "id" | "lastSaved">) => {
    const draft: DraftData = {
      ...draftData,
      id: Date.now().toString(),
      lastSaved: new Date().toISOString(),
    }
    setDrafts((prev) => [draft, ...prev])
  }

  const handleDeleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id))
  }

  const handleDeleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id))
  }
  return  (
    <WithVerification>
      <div className="container mx-auto px-4 py-8">
        <Drafts
          drafts={drafts}
          onDelete={handleDeleteDraft}
          onResume={(draft) => {
            setCurrentPage("post")
            // Pass draft data to post component
          }}
        />
      </div>
    </WithVerification>
  )
}
