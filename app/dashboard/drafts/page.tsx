"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useTranslation } from "react-i18next"
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Search, 
  Plus, 
  Clock, 
  ArrowRight, 
  Trash2,
  Building,
  Home,
  MapPin,
  DollarSign
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import DashboardSidebar from "../components/dashboard-sidebar"
import { propertiesService } from "@/lib/api/property"
import { DraftData } from "@/types"

export default function DraftsPage() {
  const { t } = useTranslation(['common', 'forms'])
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  
  const [drafts, setDrafts] = useState<DraftData[]>([])
  const [filteredDrafts, setFilteredDrafts] = useState<DraftData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [draftToDelete, setDraftToDelete] = useState<DraftData | null>(null)
  
  // Fetch drafts when component mounts
  useEffect(() => {
    const fetchDrafts = async () => {
      if (session?.user) {
        try {
          setLoading(true)
          const response = await propertiesService.getDrafts(session.user.token)
          const draftsData = response.data.data || []
          setDrafts(draftsData)
          setFilteredDrafts(draftsData)
        } catch (error) {
          console.error('Error fetching drafts:', error)
          toast({
            title: "Error",
            description: "Failed to load your drafts. Please try again later.",
            variant: "destructive"
          })
        } finally {
          setLoading(false)
        }
      }
    }
    
    fetchDrafts()
  }, [session])
  
  // Filter drafts based on search query and active tab
  useEffect(() => {
    let result = [...drafts]
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(draft => 
        draft.data?.title?.toLowerCase().includes(query) ||
        draft.data?.location?.city?.toLowerCase().includes(query) ||
        draft.data?.location?.area?.toLowerCase().includes(query) ||
        draft.data?.description?.toLowerCase().includes(query)
      )
    }
    
    // Filter by step
    if (activeTab !== 'all') {
      const step = parseInt(activeTab.replace('step', ''))
      result = result.filter(draft => draft.step === step)
    }
    
    setFilteredDrafts(result)
  }, [drafts, searchQuery, activeTab])
  
  // Handle draft deletion
  const handleDeleteDraft = async () => {
    if (!draftToDelete || !session?.user) return
    
    try {
      // Call the API to delete the draft
      await propertiesService.deleteDraft(draftToDelete._id, session.user.token)
      
      // Update local state after successful deletion
      setDrafts(prev => prev.filter(d => d._id !== draftToDelete._id))
      setFilteredDrafts(prev => prev.filter(d => d._id !== draftToDelete._id))
      
      toast({
        title: t('common:success'),
        description: t('common:draft_deleted_success'),
      })
      
      setDeleteDialogOpen(false)
      setDraftToDelete(null)
    } catch (error) {
      console.error('Error deleting draft:', error)
      toast({
        title: t('common:error'),
        description: t('common:failed_delete_draft'),
        variant: "destructive"
      })
    }
  }
  
  // Handle continue draft
  const handleContinueDraft = (draft: DraftData) => {
    router.push(`/add-property?draft=${draft._id}`)
  }
  
  // If not authenticated, redirect to login
  if (!session && !loading) {
    router.push('/auth')
    return null
  }
  
  // Count drafts by step
  const step1Count = drafts.filter(d => d.step === 1).length
  const step2Count = drafts.filter(d => d.step === 2).length
  const step3Count = drafts.filter(d => d.step === 3).length
  const step4Count = drafts.filter(d => d.step === 4).length
  
  // Helper function to get step name
  const getStepName = (step: number) => {
    switch (step) {
      case 1: return t('forms:basic_info')
      case 2: return t('forms:details')
      case 3: return t('forms:photos')
      case 4: return t('forms:review')
      default: return t('common:unknown')
    }
  }
  
  // Helper function to calculate progress percentage
  const calculateProgress = (step: number) => {
    return (step / 4) * 100
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <DashboardSidebar activePage="drafts" />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Drafts</h1>
              <p className="text-gray-600 mt-1">Continue working on your saved property drafts</p>
            </div>
            <Button 
              className="mt-4 md:mt-0" 
              onClick={() => router.push('/add-property')}
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Property
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search drafts..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full md:w-auto">
              <TabsTrigger value="all">
                All
                <Badge variant="secondary" className="ml-2">{drafts.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="step1">
                Step 1
                <Badge variant="secondary" className="ml-2">{step1Count}</Badge>
              </TabsTrigger>
              <TabsTrigger value="step2">
                Step 2
                <Badge variant="secondary" className="ml-2">{step2Count}</Badge>
              </TabsTrigger>
              <TabsTrigger value="step3">
                Step 3
                <Badge variant="secondary" className="ml-2">{step3Count}</Badge>
              </TabsTrigger>
              <TabsTrigger value="step4">
                Step 4
                <Badge variant="secondary" className="ml-2">{step4Count}</Badge>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {renderDraftList(filteredDrafts)}
            </TabsContent>
            
            <TabsContent value="step1" className="mt-6">
              {renderDraftList(filteredDrafts)}
            </TabsContent>
            
            <TabsContent value="step2" className="mt-6">
              {renderDraftList(filteredDrafts)}
            </TabsContent>
            
            <TabsContent value="step3" className="mt-6">
              {renderDraftList(filteredDrafts)}
            </TabsContent>
            
            <TabsContent value="step4" className="mt-6">
              {renderDraftList(filteredDrafts)}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Draft</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this draft? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteDraft}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
  
  // Helper function to render draft list
  function renderDraftList(drafts: DraftData[]) {
    if (loading) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading drafts...</p>
        </div>
      )
    }
    
    if (drafts.length === 0) {
      return (
        <div className="text-center py-12 border rounded-lg bg-white">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts found</h3>
          <p className="text-gray-500 mb-6">You don&apos;t have any saved drafts matching your criteria.</p>
          <Button onClick={() => router.push('/add-property')}>
            <Plus className="mr-2 h-5 w-5" />
            Start a New Property
          </Button>
        </div>
      )
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drafts.map((draft) => (
          <Card key={draft._id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {draft.data?.title || t('forms:untitled_property')}
                </CardTitle>
                <Badge variant="outline" className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {t('forms:step_of_total', { current: draft.step, total: 4 })}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {t('common:last_saved')}: {new Date(draft.lastSaved).toLocaleDateString()} {t('common:at')} {new Date(draft.lastSaved).toLocaleTimeString()}
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{draft.data?.type || t('forms:type_not_set')}</span>
                  </div>
                  
                  {draft.data?.location && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>
                        {draft.data.location.area && draft.data.location.city ? 
                          `${draft.data.location.area}, ${draft.data.location.city}` : 
                          draft.data.location.area || draft.data.location.city || t('common:location_not_specified')}
                      </span>
                    </div>
                  )}
                  
                  {draft.data?.price && (
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      <span>৳{typeof draft.data.price === 'number' ? 
                        draft.data.price.toLocaleString() : 
                        draft.data.price}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion</span>
                    <span>{calculateProgress(draft.step)}%</span>
                  </div>
                  <Progress value={calculateProgress(draft.step)} className="h-2" />
                  <p className="text-xs text-gray-500">
                    Current step: {getStepName(draft.step)}
                  </p>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0 h-auto"
                    onClick={() => {
                      setDraftToDelete(draft)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                  
                  <Button 
                    onClick={() => handleContinueDraft(draft)}
                    className="text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Continue
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
}