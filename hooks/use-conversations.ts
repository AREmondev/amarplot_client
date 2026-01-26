"use client";

import { useEffect, useState, useCallback } from "react";
import { getSocket, connectSocket, disconnectSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";
import { chatApi } from "@/lib/api/chat/chat";

interface Conversation {
  _id: string;
  type: "direct" | "group";
  participants?: any[];
  group?: any;
  lastMessage: any;
  unreadCount: number;
}

interface UseConversationsProps {
  userId?: string;
  token?: string;
  enabled?: boolean;
}

export const useConversations = ({
  userId,
  token,
  enabled = true,
}: UseConversationsProps = {}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log("Hook created", userId, token, enabled);
  // Fetch conversations from API
  const fetchConversations = useCallback(async () => {
    console.log("Fetch conversations", userId, token, enabled);
    if (!token || !enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await chatApi.getConversations(userId);
      const data = response.data;
      console.log("Conversations from api", data);
      setConversations(data);
      setUnreadCount(
        data.reduce(
          (total: number, conv: Conversation) => total + conv.unreadCount,
          0
        )
      );
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch conversations"
      );
    } finally {
      setIsLoading(false);
    }
  }, [userId, token, enabled]);

  // Mark conversation as read
  const markAsRead = useCallback(
    async (conversationId: string) => {
      // Optimistic update
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );

      setUnreadCount((prev) => {
        const conversation = conversations.find(
          (c) => c._id === conversationId
        );
        return Math.max(0, prev - (conversation?.unreadCount || 0));
      });

      try {
        await chatApi.markConversationAsRead(conversationId);

        // Emit socket event if connected
        if (socket) {
          socket.emit("markConversationAsRead", { conversationId });
        }
      } catch (error) {
        console.error("Failed to mark conversation as read:", error);
        // Revert optimistic update on error
        fetchConversations();
      }
    },
    [socket, conversations, fetchConversations]
  );

  // Mark all conversations as read
  const markAllAsRead = useCallback(async () => {
    // Optimistic update
    setConversations((prev) =>
      prev.map((conv) => ({ ...conv, unreadCount: 0 }))
    );
    setUnreadCount(0);

    try {
      // Note: This would need to be implemented in the API
      // await chatApi.markAllConversationsAsRead();

      // For now, mark each conversation individually
      const promises = conversations
        .filter((conv) => conv.unreadCount > 0)
        .map((conv) => chatApi.markConversationAsRead(conv._id));

      await Promise.all(promises);

      if (socket) {
        socket.emit("markAllConversationsAsRead", { userId });
      }
    } catch (error) {
      console.error("Failed to mark all conversations as read:", error);
      // Revert optimistic update on error
      fetchConversations();
    }
  }, [conversations, socket, userId, fetchConversations]);

  // Initialize socket connection and fetch conversations
  useEffect(() => {
    if (!userId || !token || !enabled) return;

    try {
      const socketInstance = getSocket(token);
      setSocket(socketInstance);

      // Connect if not already connected
      if (!socketInstance.connected) {
        socketInstance.connect();
      }

      // Join user room for real-time updates
      socketInstance.emit("joinRoom", { userId });

      // Listen for new messages that update conversations
      socketInstance.on("newMessage", (message: any) => {
        setConversations((prev) => {
          return prev.map((conv) => {
            if (conv._id === message.conversationId) {
              return {
                ...conv,
                lastMessage: message,
                unreadCount: conv.unreadCount + 1,
              };
            }
            return conv;
          });
        });
        setUnreadCount((prev) => prev + 1);
      });

      // Listen for conversation read updates
      socketInstance.on(
        "conversationMarkedAsRead",
        ({ conversationId }: { conversationId: string }) => {
          setConversations((prev) =>
            prev.map((conv) =>
              conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
            )
          );
        }
      );

      // Listen for all conversations marked as read
      socketInstance.on("allConversationsMarkedAsRead", () => {
        setConversations((prev) =>
          prev.map((conv) => ({ ...conv, unreadCount: 0 }))
        );
        setUnreadCount(0);
      });

      // Handle connection events
      socketInstance.on("connect", () => {
        console.log("Connected to chat socket");
      });

      socketInstance.on("connect_error", (error: any) => {
        console.error("Socket connection error:", error);
      });

      fetchConversations();

      return () => {
        socketInstance.off("connect");
        socketInstance.off("newMessage");
        socketInstance.off("conversationMarkedAsRead");
        socketInstance.off("allConversationsMarkedAsRead");
        socketInstance.off("connect_error");
      };
    } catch (error) {
      console.error("Failed to initialize conversations:", error);
      setError("Failed to initialize conversations");
      fetchConversations();
    }
  }, [userId, token, enabled, fetchConversations]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        disconnectSocket();
      }
    };
  }, [socket]);

  return {
    conversations,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: fetchConversations,
  };
};
