import { create } from 'zustand';
import { chatApi } from '@/lib/api/chat/chat';
import { toast } from '@/hooks/use-toast';

import { User as AuthUser } from "@/types";

interface User extends AuthUser {
  _id: string;
}

interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

interface PendingFile {
  _id: string;
  file: File;
  url: string;
  type: "image" | "file";
  name: string;
  size: string;
}

interface Message {
  _id: string;
  senderId: string;
  receiverId?: string;
  groupId?: string;
  content: string;
  updatedAt: string;
  type: "text" | "image" | "file" | "property";
  isRead: boolean;
  reactions: Reaction[];
  isDeleted?: boolean;
  deletedBy?: string;
  fileData?: {
    name: string;
    size: string;
    type: string;
    url: string;
  };
  propertyData?: {
    _id: string;
    title: string;
    price: string;
    image: string;
    location: string;
  };
}

interface GroupMember {
  user: User;
  role: "admin" | "member";
  joinedAt: string;
}

interface Group {
  _id: string;
  name: string;
  description: string;
  avatar: string;
  members: GroupMember[];
  createdBy: string;
  createdAt: string;
  isPrivate: boolean;
  propertyReference?: {
    _id: string;
    title: string;
    image: string;
    location: string;
  };
}

interface Conversation {
  _id: string;
  type: "direct" | "group";
  participants?: User[];
  group?: Group;
  lastMessage: Message;
  unreadCount: number;
}

interface ChatState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  newMessage: string;
  searchQuery: string;
  isMobileView: boolean;
  showEmojiPicker: boolean;
  showCreateGroup: boolean;
  showGroupInfo: boolean;
  showPropertyGroupDialog: boolean;
  showImageViewer: boolean;
  viewingImage: string;
  newGroupName: string;
  newGroupDescription: string;
  selectedUsers: string[];
  selectedProperty: any;
  dragActive: boolean;
  editingMessage: string | null;
  editContent: string;
  pendingFiles: PendingFile[];
  users: User[];
  currentUser: User | null;
  emojis: string[];
  mockProperties: any[];
  isConnected: boolean;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setSelectedConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: Message[]) => void;
  setNewMessage: (message: string) => void;
  setSearchQuery: (query: string) => void;
  setIsMobileView: (isMobile: boolean) => void;
  setShowEmojiPicker: (show: boolean) => void;
  setShowCreateGroup: (show: boolean) => void;
  setShowGroupInfo: (show: boolean) => void;
  setShowPropertyGroupDialog: (show: boolean) => void;
  setShowImageViewer: (show: boolean) => void;
  setViewingImage: (imageUrl: string) => void;
  setNewGroupName: (name: string) => void;
  setNewGroupDescription: (description: string) => void;
  setSelectedUsers: (users: string[]) => void;
  setSelectedProperty: (property: any) => void;
  setDragActive: (active: boolean) => void;
  setEditingMessage: (messageId: string | null) => void;
  setEditContent: (content: string) => void;
  setPendingFiles: (files: PendingFile[]) => void;
  setUsers: (users: User[]) => void;
  setCurrentUser: (user: User | null) => void;
  addMessage: (message: Message) => void;
  setInitialMessages: (messages: Message[]) => void;
  setIsConnected: (connected: boolean) => void;

  // Async Actions
  fetchConversations: (userId: string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  reactToMessage: (messageId: string, emoji: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  createGroup: (groupData: any) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  removeGroupMember: (groupId: string, userId: string) => Promise<void>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
  uploadFile: (formData: FormData) => Promise<any>;
}



export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  selectedConversation: null,
  messages: [],
  newMessage: "",
  searchQuery: "",
  isMobileView: false,
  showEmojiPicker: false,
  showCreateGroup:false,
  showGroupInfo: false,
  showPropertyGroupDialog: false,
  showImageViewer: false,
  viewingImage: "",
  newGroupName: "",
  newGroupDescription: "",
  selectedUsers: [],
  selectedProperty: null,
  dragActive: false,
  editingMessage: null,
  editContent: "",
  pendingFiles: [],
  users: [],
  currentUser: null,
  emojis: ["👍", "❤️", "😂", "😮", "😢", "😡", "👏", "🔥", "💯", "🎉", "🤔", "👀", "💪", "🙏", "✨"],
  mockProperties: [
    {
      _id: "1",
      title: "Modern 3 BHK Apartment in Gulshan",
      price: "৳85,00,000",
      location: "Gulshan 2, Dhaka",
      bedrooms: 3,
      bathrooms: 2,
      area: "1,450 sq ft",
      image: "/placeholder.svg?height=200&width=300",
      type: "sale",
      featured: true,
      owner: {
        _id: "owner-1",
        name: "Sarah Ahmed",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      _id: "2",
      title: "Luxury Duplex with Garden",
      price: "৳45,000/month",
      location: "Banani, Dhaka",
      bedrooms: 4,
      bathrooms: 3,
      area: "2,200 sq ft",
      image: "/placeholder.svg?height=200&width=300",
      type: "rent",
      owner: {
        _id: "owner-2",
        name: "Karim Hassan",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      _id: "3",
      title: "Commercial Office Space",
      price: "৳1,20,00,000",
      location: "Motijheel, Dhaka",
      bedrooms: 0,
      bathrooms: 2,
      area: "3,000 sq ft",
      image: "/placeholder.svg?height=200&width=300",
      type: "sale",
      owner: {
        _id: "owner-3",
        name: "Fatima Khan",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    }
  ],
  isConnected: false,

  setConversations: (conversations) => set({ conversations }),
  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  setNewMessage: (newMessage) => set({ newMessage }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setIsMobileView: (isMobileView) => set({ isMobileView }),
  setShowEmojiPicker: (showEmojiPicker) => set({ showEmojiPicker }),
  setShowCreateGroup: (showCreateGroup) => set({ showCreateGroup }),
  setShowGroupInfo: (showGroupInfo) => set({ showGroupInfo }),
  setShowPropertyGroupDialog: (showPropertyGroupDialog) => set({ showPropertyGroupDialog }),
  setShowImageViewer: (showImageViewer) => set({ showImageViewer }),
  setViewingImage: (viewingImage) => set({ viewingImage }),
  setNewGroupName: (newGroupName) => set({ newGroupName }),
  setNewGroupDescription: (newGroupDescription) => set({ newGroupDescription }),
  setSelectedUsers: (selectedUsers) => set({ selectedUsers }),
  setSelectedProperty: (selectedProperty) => set({ selectedProperty }),
  setDragActive: (dragActive) => set({ dragActive }),
  setEditingMessage: (editingMessage) => set({ editingMessage }),
  setEditContent: (editContent) => set({ editContent }),
  setPendingFiles: (pendingFiles) => set({ pendingFiles }),
  setUsers: (users) => set({ users }),
  setCurrentUser: (currentUser) => set({ currentUser }),
  addMessage: (message: Message) => set((state) => ({ messages: [...state.messages, message] })),
  setInitialMessages: (messages: Message[]) => set({ messages }),
  setIsConnected: (isConnected) => set({ isConnected }),

  fetchConversations: async (userId) => {
    try {
      const response = await chatApi.getConversations(userId);
      set({ conversations: response.data });
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations.",
        variant: "destructive",
      });
    }
  },

  fetchMessages: async (conversationId) => {
    if (!conversationId) {
      // Do not clear messages here, as historical messages will be populated by the socket
      return;
    }
    try {
      const response = await chatApi.getMessages(conversationId);
      set({ messages: response.data });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch messages.",
        variant: "destructive",
      });
    }
  },

  fetchUsers: async () => {
    try {
      const response = await chatApi.getUsers();
      set({ users: response.data });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive",
      });
    }
  },

  reactToMessage: async (messageId: string, emoji: string) => {
    const { currentUser } = get();
    try {
      await chatApi.reactToMessage(messageId, emoji);
      set((state) => ({
        messages: state.messages.map((msg) => {
          if (msg._id === messageId) {
            const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
            if (existingReaction) {
              if (existingReaction.users.includes(currentUser?._id || '')) {
                return {
                  ...msg,
                  reactions: msg.reactions
                    .map((r) =>
                      r.emoji === emoji
                        ? {
                            ...r,
                            users: r.users.filter((u) => u !== (currentUser?._id || '')),
                            count: r.count - 1,
                          }
                        : r
                    )
                    .filter((r) => r.count > 0),
                };
              } else {
                return {
                  ...msg,
                  reactions: msg.reactions.map((r) =>
                    r.emoji === emoji
                      ? {
                          ...r,
                          users: [...r.users, currentUser?._id || ''],
                          count: r.count + 1,
                        }
                      : r
                  ),
                };
              }
            } else {
              return {
                ...msg,
                reactions: [
                  ...msg.reactions,
                  {
                    emoji,
                    users: [currentUser?._id || ''],
                    count: 1,
                  },
                ],
              };
            }
          }
          return msg;
        }),
      }));
    } catch (error) {
      console.error('Error reacting to message:', error);
      toast({
        title: "Error",
        description: "Failed to react to message.",
        variant: "destructive",
      });
    }
  },

  deleteMessage: async (messageId) => {
    const { currentUser } = get();
    try {
      await chatApi.deleteMessage(messageId);
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                isDeleted: true,
                deletedBy: currentUser?._id,
                content: "This message was deleted",
              }
            : msg
        ),
      }));
      toast({
        title: "Message deleted",
        description: "The message has been deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      });
    }
  },

  editMessage: async (messageId, newContent) => {
    try {
      await chatApi.editMessage(messageId, newContent);
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                content: newContent,
              }
            : msg
        ),
        editingMessage: null,
        editContent: "",
      }));
      toast({
        title: "Message updated",
        description: "The message has been updated successfully",
      });
    } catch (error) {
      console.error("Failed to edit message:", error);
      toast({
        title: "Error",
        description: "Failed to edit message.",
        variant: "destructive",
      });
    }
  },

  createGroup: async (groupData) => {
    const { currentUser } = get();
    try {
      const response = await chatApi.createGroup({
        ...groupData,
        createdBy: currentUser?._id,
        members: [...groupData.members, currentUser?._id],
      });
      set((state) => ({
        conversations: [response.data, ...state.conversations],
        selectedConversation: response.data,
        showCreateGroup: false,
        showPropertyGroupDialog: false,
        newGroupName: "",
        newGroupDescription: "",
        selectedUsers: [],
        selectedProperty: null,
      }));
      toast({
        title: 'Group Created',
        description: `${groupData.name} has been successfully created.`,
      });
    } catch (error) {
      console.error('Failed to create group:', error);
      toast({
        title: 'Error',
        description: 'Failed to create group. Please try again.',
        variant: 'destructive',
      });
    }
  },

  leaveGroup: async (groupId) => {
    try {
      await chatApi.leaveGroup(groupId);
      set((state) => ({
        conversations: state.conversations.filter((conv) => conv._id !== groupId),
        selectedConversation: state.selectedConversation?._id === groupId ? null : state.selectedConversation,
      }));
      toast({
        title: "Left group",
        description: "You have left the group successfully",
      });
    } catch (error) {
      console.error("Failed to leave group:", error);
      toast({
        title: "Error",
        description: "Failed to leave group. Please try again.",
        variant: "destructive",
      });
    }
  },

  deleteGroup: async (groupId) => {
    try {
      await chatApi.deleteGroup(groupId);
      set((state) => ({
        conversations: state.conversations.filter((conv) => conv._id !== groupId),
        selectedConversation: state.selectedConversation?._id === groupId ? null : state.selectedConversation,
      }));
      toast({
        title: "Group deleted",
        description: "The group has been deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete group:", error);
      toast({
        title: "Error",
        description: "Failed to delete group. Please try again.",
        variant: "destructive",
      });
    }
  },

  removeGroupMember: async (groupId, userId) => {
    try {
      await chatApi.removeGroupMember(groupId, userId);
      set((state) => ({
        conversations: state.conversations.map((conv) => {
          if (conv._id === groupId && conv.group) {
            return {
              ...conv,
              group: {
                ...conv.group,
                members: conv.group.members.filter((member) => member.user._id !== userId),
              },
            };
          }
          return conv;
        }),
      }));
      toast({
        title: "Member removed",
        description: "The member has been removed from the group",
      });
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast({
        title: "Error",
        description: "Failed to remove member. Please try again.",
        variant: "destructive",
      });
    }
  },

  markConversationAsRead: async (conversationId) => {
    try {
      await chatApi.markConversationAsRead(conversationId);
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c._id === conversationId ? { ...c, unreadCount: 0 } : c
        ),
      }));
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark conversation as read.",
        variant: "destructive",
      });
    }
  },

  uploadFile: async (formData) => {
    try {
      const response = await chatApi.uploadFile(formData);
      return response;
    } catch (error) {
      console.error("Failed to upload file:", error);
      toast({
        title: "Error",
        description: "Failed to upload file.",
        variant: "destructive",
      });
      throw error;
    }
  },
}));
