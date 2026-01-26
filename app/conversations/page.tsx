"use client";

import React from "react";
import {
  MessageSquare,
  User,
  Users,
  Clock,
  Search,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConversationsContext } from "@/components/providers/conversations-provider";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

// Helper functions
const getConversationName = (conversation: any, currentUserId?: string) => {
  if (conversation.type === "group") {
    return conversation.group?.name || "Group Chat";
  } else {
    const otherParticipant = conversation.participants?.find(
      (p: any) => p._id !== currentUserId
    );
    return otherParticipant?.name || "Unknown User";
  }
};

const getConversationAvatar = (conversation: any, currentUserId?: string) => {
  if (conversation.type === "group") {
    return conversation.group?.avatar || "/placeholder.svg";
  } else {
    const otherParticipant = conversation.participants?.find(
      (p: any) => p._id !== currentUserId
    );
    return otherParticipant?.avatar || "/placeholder.svg";
  }
};

const getConversationIcon = (type: string) => {
  switch (type) {
    case "group":
      return <Users className="h-4 w-4 text-blue-600" />;
    case "direct":
      return <User className="h-4 w-4 text-green-600" />;
    default:
      return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
  }
};

const getMessagePreview = (message: any) => {
  if (!message) return "No messages yet";
  
  switch (message.type) {
    case "image":
      return "📷 Image";
    case "file":
      return "📎 File";
    case "property":
      return "🏠 Property";
    default:
      return message.content || "Message";
  }
};

const getConversationBgColor = (type: string) => {
  switch (type) {
    case "group":
      return "bg-blue-500";
    case "direct":
      return "bg-green-500";
    default:
      return "bg-muted";
  }
};

const ConversationItem: React.FC<{
  conversation: any;
  currentUserId?: string;
  onMarkAsRead: (id: string) => void;
}> = ({ conversation, currentUserId, onMarkAsRead }) => {
  const handleClick = () => {
    if (conversation.unreadCount > 0) {
      onMarkAsRead(conversation._id);
    }
  };

  const conversationName = getConversationName(conversation, currentUserId);
  const conversationAvatar = getConversationAvatar(conversation, currentUserId);
  const messagePreview = getMessagePreview(conversation.lastMessage);
  const timeAgo = conversation.lastMessage?.updatedAt
    ? formatDistanceToNow(new Date(conversation.lastMessage.updatedAt), { addSuffix: true })
    : "";

  return (
    <li
      className={`p-4 flex items-start gap-4 cursor-pointer transition-colors border-b ${
        conversation.unreadCount > 0
          ? "bg-secondary/50 hover:bg-secondary/70"
          : "hover:bg-secondary/30"
      }`}
      onClick={handleClick}
    >
      <Link
        href={`/chat?conversation=${conversation._id}`}
        className="flex items-start gap-4 w-full"
      >
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={conversationAvatar} alt={conversationName} />
            <AvatarFallback className={getConversationBgColor(conversation.type)}>
              {conversationName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1">
            <div className="h-6 w-6 rounded-full bg-background flex items-center justify-center border">
              {getConversationIcon(conversation.type)}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p
              className={`text-sm font-medium truncate ${
                conversation.unreadCount > 0
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {conversationName}
            </p>
            {timeAgo && (
              <p className="text-xs text-muted-foreground ml-2">{timeAgo}</p>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {messagePreview}
          </p>
          <div className="flex items-center justify-between mt-2">
            <Badge variant="outline" className="text-xs">
              {conversation.type === "group" ? "Group" : "Direct"}
            </Badge>
            {conversation.unreadCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <Badge variant="secondary" className="text-xs">
                  {conversation.unreadCount} new
                </Badge>
              </div>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default function ConversationsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    conversations,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch,
  } = useConversationsContext();

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    const conversationName = getConversationName(conversation);
    const messageContent = conversation.lastMessage?.content || "";
    const searchTerm = searchQuery.toLowerCase();
    
    return (
      conversationName.toLowerCase().includes(searchTerm) ||
      messageContent.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {t("Conversations") || "Conversations"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {unreadCount > 0
                    ? `${unreadCount} unread conversation${unreadCount > 1 ? "s" : ""}`
                    : "All conversations are up to date"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" onClick={markAllAsRead}>
                  {t("Mark all as read") || "Mark all as read"}
                </Button>
              )}
              <Button asChild>
                <Link href="/chat">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("New Chat") || "New Chat"}
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("Search conversations...") || "Search conversations..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {t("Loading conversations...") || "Loading conversations..."}
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <MessageSquare className="h-8 w-8 mx-auto mb-4 text-destructive" />
                <p className="text-destructive mb-4">
                  {t("Failed to load conversations") || "Failed to load conversations"}
                </p>
                <Button variant="outline" onClick={refetch}>
                  {t("Try again") || "Try again"}
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredConversations.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery
                    ? t("No conversations found") || "No conversations found"
                    : t("No conversations yet") || "No conversations yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? t("Try adjusting your search terms") || "Try adjusting your search terms"
                    : t("Start a conversation to see it here") || "Start a conversation to see it here"}
                </p>
                {!searchQuery && (
                  <Button asChild>
                    <Link href="/chat">
                      <Plus className="h-4 w-4 mr-2" />
                      {t("Start a conversation") || "Start a conversation"}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Conversations List */}
          {!isLoading && !error && filteredConversations.length > 0 && (
            <ul className="space-y-0 border rounded-lg overflow-hidden">
              {filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation._id}
                  conversation={conversation}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}