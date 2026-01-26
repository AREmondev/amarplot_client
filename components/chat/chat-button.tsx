"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast";

interface ChatButtonProps {
  ownerId: string
  ownerName: string
  propertyId?: string
  propertyTitle?: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  className?: string
}

export default function ChatButton({
  ownerId,
  ownerName,
  propertyId,
  propertyTitle,
  variant = "default",
  size = "default",
  className = "",
}: ChatButtonProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleChatClick = () => {
    // In a real app, you would:
    // 1. Check if user is authenticated
    // 2. Create or find existing conversation
    // 3. Navigate to chat with the specific conversation

    // For now, we'll simulate creating a conversation and navigating
    const conversationId = `conv-${ownerId}-${Date.now()}`

    // Show success message
    toast({
      title: "Starting conversation",
      description: `Opening chat with ${ownerName}`,
    })

    // Navigate to chat page with conversation context
    router.push(`/chat?conversation=${conversationId}&owner=${ownerId}`)
  }

  return (
    <Button variant={variant} size={size} onClick={handleChatClick} className={`flex items-center gap-2 ${className}`}>
      <MessageCircle className="h-4 w-4" />
      Chat with {ownerName}
    </Button>
  )
}
