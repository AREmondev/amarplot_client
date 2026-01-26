import apiClient from "../axios";

// Types for API responses
interface ConversationsResponse {
  data: any[];
}

interface MessagesResponse {
  data: any[];
}

interface MessageResponse {
  data: any;
}

interface GroupResponse {
  data: any;
}

interface UsersResponse {
  data: any[];
}

export const chatApi = {
  getConversations: async (userId: string): Promise<ConversationsResponse> => {
    const response = await apiClient.get(`/chat/conversations/${userId}`);
    return response.data;
  },
  getMessages: async (conversationId: string): Promise<MessagesResponse> => {
    const response = await apiClient.get(`/chat/messages/${conversationId}`);
    return response.data;
  },
  sendMessage: async (message: any): Promise<MessageResponse> => {
    const response = await apiClient.post("/chat/messages", message);
    return response.data;
  },
  createGroup: async (group: any): Promise<GroupResponse> => {
    const response = await apiClient.post("/chat/groups", group);
    return response.data;
  },
  leaveGroup: async (groupId: string): Promise<void> => {
    const response = await apiClient.post(`/chat/groups/${groupId}/leave`);
    return response.data;
  },
  deleteGroup: async (groupId: string): Promise<void> => {
    const response = await apiClient.delete(`/chat/groups/${groupId}`);
    return response.data;
  },
  removeGroupMember: async (groupId: string, userId: string): Promise<void> => {
    const response = await apiClient.post(`/chat/groups/${groupId}/remove-member`, { userId });
    return response.data;
  },
  markConversationAsRead: async (conversationId: string): Promise<void> => {
    const response = await apiClient.post(`/chat/conversations/${conversationId}/read`);
    return response.data;
  },
  reactToMessage: async (messageId: string, emoji: string): Promise<void> => {
    const response = await apiClient.post(`/chat/messages/${messageId}/react`, { emoji });
    return response.data;
  },
  deleteMessage: async (messageId: string): Promise<void> => {
    const response = await apiClient.delete(`/chat/messages/${messageId}`);
    return response.data;
  },
  editMessage: async (messageId: string, content: string): Promise<MessageResponse> => {
    const response = await apiClient.put(`/chat/messages/${messageId}`, { content });
    return response.data;
  },
  uploadFile: async (formData: FormData): Promise<any> => {
    const response = await apiClient.post("/chat/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  getUsers: async (): Promise<UsersResponse> => {
    const response = await apiClient.get("/user");
    return response.data;
  }
};
