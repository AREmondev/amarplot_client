import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/lib/api/chat/chat";
import { useChatStore } from "@/lib/store/chatStore";
import { useEffect } from "react";

export function useConversationsQuery(userId?: string, enabled = true) {
  const { setConversations } = useChatStore();
  const query = useQuery({
    queryKey: ["conversations", userId],
    enabled: !!userId && enabled,
    queryFn: async () => {
      const res = await chatApi.getConversations(userId as string);
      return res.data;
    },
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  useEffect(() => {
    if (query.data) {
      setConversations(query.data as any[]);
    }
  }, [query.data, setConversations]);
  return query;
}

export function useMessagesQuery(conversationId?: string, enabled = true) {
  const { setInitialMessages } = useChatStore();
  const query = useQuery({
    queryKey: ["messages", conversationId],
    enabled: !!conversationId && enabled,
    queryFn: async () => {
      const res = await chatApi.getMessages(conversationId as string);
      return res.data;
    },
    staleTime: 30 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  useEffect(() => {
    if (query.data) {
      setInitialMessages(query.data as any[]);
    }
  }, [query.data, setInitialMessages]);
  return query;
}

export function useMarkConversationAsRead() {
  const queryClient = useQueryClient();
  const { setConversations } = useChatStore();
  return useMutation({
    mutationFn: async (conversationId: string) => {
      await chatApi.markConversationAsRead(conversationId);
      return conversationId;
    },
    onSuccess: (conversationId) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setConversations(
        (queryClient.getQueryData(["conversations"]) as any[])?.map((c) =>
          c._id === conversationId ? { ...c, unreadCount: 0 } : c,
        ) || [],
      );
    },
  });
}
