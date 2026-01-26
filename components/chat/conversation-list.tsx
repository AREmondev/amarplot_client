import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Users, Home } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import CreateGroupDialog from './create-group-dialog';
import CreatePropertyGroupDialog from './create-property-group-dialog';

interface ConversationListProps {
  isMobileView: boolean;
}

export default function ConversationList({ isMobileView }: ConversationListProps) {
  const { 
    conversations, 
    selectedConversation, 
    setSelectedConversation, 
    searchQuery, 
    setSearchQuery, 
    currentUser, 
    markConversationAsRead,
    showCreateGroup,
    setShowCreateGroup,
    showPropertyGroupDialog,
    setShowPropertyGroupDialog,
    fetchMessages
  } = useChatStore();

  const getConversationName = (conversation: any) => {
    if (conversation.type === "group") {
      return conversation.group?.name || "Group";
    } else {
      return conversation.participants?.find((p: any) => p._id !== currentUser?._id)?.name || "User";
    }
  };

  const getConversationAvatar = (conversation: any) => {
    if (conversation.type === "group") {
      return conversation.group?.avatar || "/placeholder.svg";
    } else {
      return conversation.participants?.find((p: any) => p._id !== currentUser?._id)?.avatar || "/placeholder.svg";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-green-500 text-white";
      case "agent":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatMessageTime = (updatedAt: string) => {
    const date = new Date(updatedAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    console.log("conv", conv)
    if (conv.type === "direct") {
      const otherParticipant = conv.participants?.find((p: any) => p._id !== currentUser?._id);
      return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      return conv.group?.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  return (
    <Card className={`${isMobileView && selectedConversation ? "hidden" : ""}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Messages</span>
          <div className="flex gap-2">
            <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <CreateGroupDialog />
            </Dialog>

            <Dialog open={showPropertyGroupDialog} onOpenChange={setShowPropertyGroupDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <CreatePropertyGroupDialog />
            </Dialog>

            <Badge variant="secondary">{conversations.length}</Badge>
          </div>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {filteredConversations.map((conversation) => {
            const isSelected = selectedConversation?._id === conversation._id;

            return (
              <div
                key={conversation._id}
                onClick={async () => {
                  setSelectedConversation(conversation);
                  if (conversation.unreadCount > 0) {
                    await markConversationAsRead(conversation._id);
                  }
                  fetchMessages(conversation._id);
                }}
                className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                  isSelected ? "bg-muted" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={getConversationAvatar(conversation) || "/placeholder.svg"} />
                      <AvatarFallback>{getConversationName(conversation).charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.type === "group" ? (
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users className="h-2 w-2 text-white" />
                      </div>
                    ) : (
                      <div
                        className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${conversation.participants?.find((p: any) => p._id !== currentUser?._id)?.isOnline
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold truncate">{getConversationName(conversation)}</h4>
                        {conversation.type === "direct" && (
                          <Badge
                            className={`text-xs ${getRoleColor(
                              conversation.participants?.find((p: any) => p._id !== currentUser?._id)?.role || "user",
                            )}`}
                          >
                            {conversation.participants?.find((p: any) => p._id !== currentUser?._id)?.role}
                          </Badge>
                        )}
                        {conversation.type === "group" && conversation.group?.propertyReference && (
                          <Badge variant="outline" className="text-xs">
                            <Home className="h-3 w-3 mr-1" />
                            Property
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {conversation?.lastMessage?.updatedAt && formatMessageTime(conversation?.lastMessage?.updatedAt)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage?.type === "property"
                        ? "📋 Shared a property"
                        : conversation.lastMessage?.type === "file"
                          ? "📎 Shared a file"
                          : conversation.lastMessage?.type === "image"
                            ? "🖼️ Shared an image"
                            : conversation?.lastMessage?.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
