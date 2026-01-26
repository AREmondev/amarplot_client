import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, Video, Settings, MoreVertical, ArrowLeft, Home } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import GroupInfoDialog from './group-info-dialog';

interface ChatHeaderProps {
  isMobileView: boolean;
}

export default function ChatHeader({ isMobileView }: ChatHeaderProps) {
  const { selectedConversation, setSelectedConversation, currentUser } = useChatStore();

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

  if (!selectedConversation) return null;

  return (
    <div className="flex items-center justify-between pb-4">
      <div className="flex items-center gap-3">
        {isMobileView && (
          <Button variant="ghost" size="sm" onClick={() => setSelectedConversation(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Avatar className="h-12 w-12">
          <AvatarImage src={getConversationAvatar(selectedConversation) || "/placeholder.svg"} />
          <AvatarFallback>{getConversationName(selectedConversation).charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{getConversationName(selectedConversation)}</h3>
          {selectedConversation.type === "group" ? (
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {selectedConversation.group?.members.length} members
              </p>
              {selectedConversation.group?.propertyReference && (
                <Badge variant="outline" className="text-xs">
                  <Home className="h-3 w-3 mr-1" />
                  {selectedConversation.group.propertyReference.title}
                </Badge>
              )}
            </div>
          ) :(
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${selectedConversation.participants?.find((p: any) => p._id !== currentUser?._id)?.isOnline
                  ? "bg-green-500"
                  : "bg-gray-400"
              }`}
              ></div>
              <span className="text-sm text-muted-foreground">
                {selectedConversation.participants?.find((p: any) => p._id !== currentUser?._id)?.isOnline
                  ? "Online"
                  : `Last seen ${formatDistanceToNow(
                      new Date(
                        selectedConversation.participants?.find((p: any) => p._id !== currentUser?._id)?.lastSeen || "",
                      ),
                      { addSuffix: true },
                    )}`}
              </span>
              <Badge
                className={`text-xs ${getRoleColor(
                  selectedConversation.participants?.find((p: any) => p._id !== currentUser?._id)?.role || "user",
                )}`}
              >
                {selectedConversation.participants?.find((p: any) => p._id !== currentUser?._id)?.role}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Video className="h-4 w-4" />
        </Button>
        {selectedConversation.type === "group" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <GroupInfoDialog />
          </Dialog>
        )}
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
