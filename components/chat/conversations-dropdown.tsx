"use client";

import React from "react";
import { MessageSquare, User, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConversations } from "@/hooks/use-conversations";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";

interface ConversationsDropdownProps {
  userId?: string;
  token?: string;
  className?: string;
}

// Helper function to get conversation display name
const getConversationName = (conversation: any, currentUserId?: string) => {
  if (conversation.type === "group") {
    return conversation.group?.name || "Group Chat";
  } else {
    const otherParticipant = conversation.participants?.find(
      (p: any) => p._id !== currentUserId,
    );
    return otherParticipant?.name || "Unknown User";
  }
};

// Helper function to get conversation avatar
const getConversationAvatar = (conversation: any, currentUserId?: string) => {
  if (conversation.type === "group") {
    return conversation.group?.avatar || "/placeholder.svg";
  } else {
    const otherParticipant = conversation.participants?.find(
      (p: any) => p._id !== currentUserId,
    );
    return otherParticipant?.avatar || "/placeholder.svg";
  }
};

// Helper function to get conversation icon
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

// Helper function to format message preview
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
    ? formatDistanceToNow(new Date(conversation.lastMessage.updatedAt), {
        addSuffix: true,
      })
    : "";

  return (
    <DropdownMenuItem
      className={`group p-3 cursor-pointer transition-all duration-200 border-l-2 ${
        conversation.unreadCount > 0
          ? "bg-blue-50/50 hover:bg-blue-50/70 border-l-blue-500 dark:bg-blue-950/20 dark:hover:bg-blue-950/30"
          : "hover:bg-secondary/30 border-l-transparent"
      }`}
      onClick={handleClick}
      asChild
    >
      <Link href={`/chat?conversation=${conversation._id}`}>
        <div className="relative flex-shrink-0">
          <Avatar className="h-10 w-10 transition-all duration-200 group-hover:scale-105">
            <AvatarImage src={conversationAvatar} alt={conversationName} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {conversationName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -top-1 -right-1">
            <div
              className={`h-5 w-5 rounded-full bg-background flex items-center justify-center shadow-sm transition-all duration-200 ${
                conversation.unreadCount > 0
                  ? "ring-2 ring-blue-200 dark:ring-blue-800"
                  : ""
              } group-hover:bg-white`}
            >
              {getConversationIcon(conversation.type)}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p
              className={`text-sm font-medium truncate transition-colors duration-200 ${
                conversation.unreadCount > 0
                  ? "text-foreground group-hover:text-white"
                  : "text-muted-foreground group-hover:text-white"
              }`}
            >
              {conversationName}
            </p>
            {timeAgo && (
              <p className="text-xs text-muted-foreground ml-2 transition-colors duration-200 group-hover:text-white">
                {timeAgo}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate transition-colors duration-200 group-hover:text-white">
            {messagePreview}
          </p>
          {conversation.unreadCount > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
              <Badge
                variant="secondary"
                className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 transition-all duration-200 group-hover:bg-white group-hover:text-blue-700"
              >
                {conversation.unreadCount} new
              </Badge>
            </div>
          )}
        </div>
        {conversation.unreadCount > 0 && (
          <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-2 animate-pulse" />
        )}
      </Link>
    </DropdownMenuItem>
  );
};

export const ConversationsDropdown: React.FC<ConversationsDropdownProps> = ({
  userId,
  token,
  className = "",
}) => {
  const { t } = useTranslation();
  const {
    conversations,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch,
  } = useConversations({
    userId,
    token,
    enabled: !!userId && !!token,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`relative transition-all duration-200 ${className} ${
            unreadCount > 0 ? "text-blue-600 hover:text-blue-700" : ""
          }`}
          disabled={isLoading}
        >
          <MessageSquare
            className={`h-5 w-5 transition-all duration-200 ${
              unreadCount > 0 ? "animate-pulse" : ""
            }`}
          />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-500 hover:bg-blue-600 animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 shadow-lg border-0 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95"
      >
        <DropdownMenuLabel className="flex items-center justify-between p-1.5">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            <span className="font-semibold">
              {t("Conversations") || "Conversations"}
            </span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-auto p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              onClick={markAllAsRead}
              disabled={isLoading}
            >
              {t("Mark all as read") || "Mark all as read"}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {error && (
          <div className="p-4 text-center text-sm text-red-500 bg-red-50 dark:bg-red-900/20 m-2 rounded-lg">
            <MessageSquare className="h-5 w-5 mx-auto mb-2" />
            {error}
          </div>
        )}

        {isLoading && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              Loading conversations...
            </div>
          </div>
        )}

        {!isLoading && !error && conversations.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-blue-400" />
            </div>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              No conversations yet
            </p>
            <p className="text-xs">
              {t("Start a conversation to see it here") ||
                "Start a conversation to see it here"}
            </p>
          </div>
        )}

        {!isLoading && !error && conversations && conversations.length > 0 && (
          <ScrollArea className="max-h-80">
            <div className="space-y-0">
              {conversations.slice(0, 10).map((conversation, index) => (
                <div
                  key={conversation._id}
                  className={
                    index < conversations.length - 1
                      ? "border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                      : ""
                  }
                >
                  <ConversationItem
                    conversation={conversation}
                    currentUserId={userId}
                    onMarkAsRead={markAsRead}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        {conversations.length > 0 && (
          <>
            <DropdownMenuSeparator className="my-2" />
            <div className="p-2">
              <Link
                href="/conversations"
                className="group flex items-center justify-center gap-2 w-full py-3 px-4 text-sm font-medium text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              >
                <MessageSquare className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                {t("View all conversations") || "View all conversations"}
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConversationsDropdown;
