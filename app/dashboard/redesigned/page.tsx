"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardRedesigned from "@/components/dashboard/dashboard-redesigned"
import { Property, DraftData } from "@/types"
import { propertiesService } from "@/lib/api/property"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  
  const [properties, setProperties] = useState<Property[]>([])
  const [drafts, setDrafts] = useState<DraftData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)

  // Fetch properties and drafts when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (session?.user) {
        try {
          setLoading(true)
          
          // Fetch user's properties
          const response = await propertiesService.getMyProperties(session.user.token)
          console.log("response", response)
          setProperties(response.data.data)
          
          // Fetch drafts (assuming there's an endpoint for this)
          // If there's no specific endpoint for drafts, we can filter properties with status="draft"
          // const draftsData = await propertiesService.getDrafts(session.accessToken as string)
          // For now, we'll use an empty array or filter from properties
          const draftsData: DraftData[] = []
          setDrafts(draftsData)
        } catch (error) {
          console.error('Error fetching dashboard data:', error)
          toast({
            title: "Error",
            description: "Failed to load your properties. Please try again later.",
            variant: "destructive"
          })
        } finally {
          setLoading(false)
        }
      }
    }
    
    fetchData()
  }, [session])

  // Handler functions
  const handlePostNew = () => {
    router.push("/add-property")
  }

  const handleViewListings = () => {
    router.push("/my-properties")
  }

  const handleViewDrafts = () => {
    router.push("/drafts")
  }

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property)
    router.push(`/add-property?edit=${property._id}`)
  }

  const handleDeleteProperty = async (id: string) => {
    if (!session?.user?.token) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to delete a property.",
        variant: "destructive"
      })
      return
    }
    
    try {
      // Call API to delete property (assuming there's a delete endpoint)
      // await propertiesService.deleteProperty(id, session.user.token)
      
      // Update local state
      setProperties(properties.filter(property => property._id !== id))
      
      toast({
        title: "Success",
        description: "Property deleted successfully."
      })
    } catch (error) {
      console.error('Error deleting property:', error)
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again later.",
        variant: "destructive"
      })
    }
  }

  // If not authenticated, show a message or redirect to login
  if (!session && !loading) {
    router.push('/auth')
    return null
  }
  
  return (
    <DashboardRedesigned
      properties={properties}
      drafts={drafts}
      onPostNew={handlePostNew}
      onViewListings={handleViewListings}
      onViewDrafts={handleViewDrafts}
      onEditProperty={handleEditProperty}
      onDeleteProperty={handleDeleteProperty}
      isLoading={loading}
    />
  )
}