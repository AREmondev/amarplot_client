"use client";

import React, { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Send } from "lucide-react";
import { useChatStore } from "@/lib/store/chatStore";
import { useChatSocket } from "@/hooks/use-chat-socket";
import type { Message as SocketMessage } from "@/hooks/use-chat-socket";
import {
  useConversationsQuery,
  useMessagesQuery,
} from "@/hooks/use-chat-queries";

import ConversationList from "./conversation-list";
import ChatHeader from "./chat-header";
import MessageDisplay from "./message-display";
import MessageInput from "./message-input";
import ImageViewerDialog from "./image-viewer-dialog";

export default function ChatPage() {
  type StoreMessage = {
    _id: string;
    senderId: string;
    receiverId?: string;
    groupId?: string;
    content: string;
    updatedAt: string;
    type: "text" | "image" | "file" | "property";
    isRead: boolean;
    reactions: Array<{ emoji: string; users: string[]; count: number }>;
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
    conversationId?: string;
    createdAt?: string;
  };

  const toStoreMessage = (msg: SocketMessage): StoreMessage => ({
    ...msg,
    propertyData: msg.propertyData
      ? {
          _id: msg.propertyData.id,
          title: msg.propertyData.title,
          price: msg.propertyData.price,
          image: msg.propertyData.image,
          location: msg.propertyData.location,
        }
      : undefined,
  });

  const {
    selectedConversation,
    isMobileView,
    setIsMobileView,
    currentUser,
    setCurrentUser,
    fetchConversations,
    fetchUsers,
    setMessages,
    addMessage,
    setInitialMessages,
    setIsConnected,
  } = useChatStore();
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    connectSocket,
    disconnectSocket,
    joinConversation,
    leaveConversation,
    sendMessage,
  } = useChatSocket();

  useEffect(() => {
    setCurrentUser(session?.user || null);
  }, [session?.user, setCurrentUser]);

  useConversationsQuery(currentUser?._id, !!currentUser?._id);
  useMessagesQuery(selectedConversation?._id, !!selectedConversation?._id);

  useEffect(() => {
    console.log("session?.user", session?.user);
    if (currentUser?._id && session?.user?.token) {
      const cleanup = connectSocket(
        session.user.token,
        (newMessage: SocketMessage) => {
          addMessage(toStoreMessage(newMessage) as any);
        },
        (historicalMessages: SocketMessage[]) => {
          setInitialMessages(historicalMessages.map(toStoreMessage) as any);
        },
      );
      setIsConnected(true);
      return () => {
        setIsConnected(false);
        cleanup();
      };
    } else {
      setIsConnected(false);
    }
  }, [
    currentUser?._id,
    session?.user?.token,
    connectSocket,
    addMessage,
    setInitialMessages,
    setIsConnected,
  ]);

  useEffect(() => {
    if (currentUser?._id) {
      fetchUsers();
    }
  }, [currentUser?._id, fetchUsers]);

  useEffect(() => {
    if (selectedConversation?._id) {
      joinConversation(selectedConversation._id);
    } else {
      setMessages([]);
    }
    return () => {
      if (selectedConversation?._id) {
        leaveConversation(selectedConversation._id);
      }
    };
  }, [
    selectedConversation?._id,
    joinConversation,
    leaveConversation,
    setMessages,
  ]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setIsMobileView]);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          <ConversationList isMobileView={isMobileView} />

          <div
            className={`md:col-span-2 ${!selectedConversation && isMobileView ? "hidden" : ""}`}
          >
            {selectedConversation ? (
              <Card className="h-[800px] flex flex-col">
                <ChatHeader isMobileView={isMobileView} />
                <Separator />
                <MessageDisplay messagesEndRef={messagesEndRef} />
                <Separator />
                <MessageInput
                  fileInputRef={fileInputRef}
                  sendMessage={sendMessage}
                />
              </Card>
            ) : (
              <Card className="h-full py-10 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start chatting
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      <ImageViewerDialog />
    </div>
  );
}
