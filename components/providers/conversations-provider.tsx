"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useConversations } from "@/hooks/use-conversations";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Conversation {
  _id: string;
  type: "direct" | "group";
  participants?: any[];
  group?: any;
  lastMessage: any;
  unreadCount: number;
}

interface ConversationsContextType {
  conversations: Conversation[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (conversationId: string) => void;
  markAllAsRead: () => void;
  refetch: () => void;
}

const ConversationsContext = createContext<ConversationsContextType | undefined>(
  undefined
);

interface ConversationsProviderProps {
  children: React.ReactNode;
}

export const ConversationsProvider: React.FC<ConversationsProviderProps> = ({
  children,
}) => {
  const { data: session } = useSession();
  const [showToasts, setShowToasts] = useState(true);

  const userId = session?.user?.id;
  const token = session?.user?.token;

  const conversationsHook = useConversations({
    userId,
    token,
    enabled: !!userId && !!token,
  });

  const {
    conversations,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch,
  } = conversationsHook;

  // Show toast notifications for new messages
  useEffect(() => {
    if (!showToasts || conversations.length === 0) return;
    
    // Get conversations with unread messages
    const unreadConversations = conversations.filter((conv) => conv.unreadCount > 0);

    if (unreadConversations.length > 0) {
      // Get the most recent conversation with unread messages
      const latestConversation = unreadConversations[0];
      
      if (latestConversation.lastMessage) {
        // Only show toast for very recent messages (to avoid spam on initial load)
        const messageTime = new Date(latestConversation.lastMessage.updatedAt);
        const now = new Date();
        const timeDiff = now.getTime() - messageTime.getTime();

        // Show toast only if message is less than 5 minutes old
        if (timeDiff < 5 * 60 * 1000) {
          const conversationName = getConversationDisplayName(latestConversation, userId);
          const messagePreview = getMessagePreview(latestConversation.lastMessage);
          
          toast(`New message from ${conversationName}`, {
            description: messagePreview,
            action: {
              label: "View",
              onClick: () => {
                markAsRead(latestConversation._id);
                // Navigate to chat page
                window.location.href = `/chat?conversation=${latestConversation._id}`;
              },
            },
            duration: 5000,
          });
        }
      }
    }
  }, [conversations, showToasts, markAsRead, userId]);

  // Disable toast notifications after initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToasts(false);
    }, 2000); // Disable toasts after 2 seconds of initial load

    return () => clearTimeout(timer);
  }, []);

  const contextValue: ConversationsContextType = {
    conversations,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch,
  };

  return (
    <ConversationsContext.Provider value={contextValue}>
      {children}
    </ConversationsContext.Provider>
  );
};

export const useConversationsContext = () => {
  const context = useContext(ConversationsContext);
  if (context === undefined) {
    throw new Error(
      "useConversationsContext must be used within a ConversationsProvider"
    );
  }
  return context;
};

// Helper functions
const getConversationDisplayName = (conversation: any, currentUserId?: string) => {
  if (conversation.type === "group") {
    return conversation.group?.name || "Group Chat";
  } else {
    const otherParticipant = conversation.participants?.find(
      (p: any) => p._id !== currentUserId
    );
    return otherParticipant?.name || "Unknown User";
  }
};

const getMessagePreview = (message: any) => {
  if (!message) return "New message";
  
  switch (message.type) {
    case "image":
      return "📷 Sent an image";
    case "file":
      return "📎 Sent a file";
    case "property":
      return "🏠 Shared a property";
    default:
      return message.content || "New message";
  }
};

export default ConversationsProvider;