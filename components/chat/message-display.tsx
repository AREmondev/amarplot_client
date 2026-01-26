import React, { useRef, useEffect } from 'react';
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Check, CheckCheck, Copy, Download, Edit3, ExternalLink, Film, FileText, ImageIcon, MapPin, Music, Reply, Trash2, Eye, Archive, MoreVertical, Paperclip } from 'lucide-react';
import { useChatStore } from '@/lib/store/chatStore';
import { formatDistanceToNow } from 'date-fns';

interface MessageDisplayProps {
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function MessageDisplay({ messagesEndRef }: MessageDisplayProps) {
  const {
    messages,
    selectedConversation,
    currentUser,
    editingMessage,
    setEditingMessage,
    editContent,
    setEditContent,
    editMessage,
    deleteMessage,
    reactToMessage,
    setNewMessage,
    setShowImageViewer,
    setViewingImage,
    setDragActive,
    dragActive
  } = useChatStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messagesEndRef]);

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="h-8 w-8 text-red-500" />;
    if (type.includes("image")) return <ImageIcon className="h-8 w-8 text-green-500" />;
    if (type.includes("audio")) return <Music className="h-8 w-8 text-purple-500" />;
    if (type.includes("video")) return <Film className="h-8 w-8 text-blue-500" />;
    return <Archive className="h-8 w-8 text-gray-500" />;
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // File handling logic will be in MessageInput
  };

  const renderMessage = (message: any) => {
    const isCurrentUser = message.senderId === currentUser?._id;
    const sender = isCurrentUser
      ? currentUser
      : selectedConversation?.type === "group"
        ? selectedConversation.group?.members.find((m: any) => m.user._id === message.senderId)?.user
        : selectedConversation?.participants?.find((p: any) => p._id === message.senderId);

    if (message.isDeleted) {
      return (
        <div key={message._id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
          <div className="flex items-center gap-2 text-muted-foreground italic text-sm">
            <Trash2 className="h-4 w-4" />
            <span>This message was deleted</span>
          </div>
        </div>
      );
    }

    return (
      <div key={message._id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4 group`}>
        <div className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[70%]`}>
          {!isCurrentUser && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={sender?.avatar || "/placeholder.svg"} />
              <AvatarFallback>{sender?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          )}

          <div className="space-y-1">
            {selectedConversation?.type === "group" && !isCurrentUser && (
              <p className="text-xs text-muted-foreground px-2">{sender?.name}</p>
            )}

            <div className="relative">
              {editingMessage === message._id ? (
                <div className="space-y-2">
                  <Input
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        editMessage(message._id, editContent);
                      }
                      if (e.key === "Escape") {
                        setEditingMessage(null);
                        setEditContent("");
                      }
                    }}
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => editMessage(message._id, editContent)}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingMessage(null);
                        setEditContent("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {message.type === "image" && message.fileData ? (
                    <div className={`relative ${isCurrentUser ? "bg-primary/10" : "bg-muted"} rounded-2xl p-2`}>
                      <Image
                        src={message.fileData.url || "/placeholder.svg"}
                        alt={message.fileData.name}
                        className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        width={320}
                        height={180}
                        onClick={() => {
                          setViewingImage(message.fileData?.url || "");
                          setShowImageViewer(true);
                        }}
                      />
                      <p className="text-sm mt-2 px-2">{message.content}</p>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setViewingImage(message.fileData?.url || "");
                            setShowImageViewer(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : message.type === "file" && message.fileData ? (
                    <div
                      className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:opacity-80 transition-opacity ${
                        isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                      onClick={() => window.open(message.fileData?.url, "_blank")}
                    >
                      {getFileIcon(message.fileData.type)}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{message.fileData.name}</p>
                        <p className="text-xs opacity-75">{message.fileData.size}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(message.fileData?.url, "_blank");
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Download className="h-4 w-4" />
                      </div>
                    </div>
                  ) : message.type === "property" && message.propertyData ? (
                    <Card className={`${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <CardContent className="p-3">
                        <div className="flex gap-3">
                          <Image
                            src={message.propertyData.image || "/placeholder.svg"}
                            alt={message.propertyData.title}
                            className="w-16 h-16 rounded object-cover"
                            width={64}
                            height={64}
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{message.propertyData.title}</h4>
                            <p className="text-sm opacity-90">{message.propertyData.price}</p>
                            <div className="flex items-center gap-1 text-xs opacity-75">
                              <MapPin className="h-3 w-3" />
                              {message.propertyData.location}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isCurrentUser
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-foreground rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  )}

                  {/* Message Actions */}
                  {isCurrentUser && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 right-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingMessage(message._id);
                              setEditContent(message.content);
                            }}
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(message.content)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setNewMessage(`> ${message.content}\n`)}>
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteMessage(message._id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Reactions */}
            {message?.reactions?.length > 0 && (
              <div className="flex flex-wrap gap-1 px-2">
                {message.reactions.map((reaction: any) => (
                  <button
                    key={reaction.emoji}
                    onClick={() => reactToMessage(message._id, reaction.emoji)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                      reaction.users.includes(currentUser?._id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    <span>{reaction.emoji}</span>
                    <span>{reaction.count}</span>
                  </button>
                ))}
              </div>
            )}

            <div
              className={`flex items-center gap-1 text-xs text-muted-foreground ${isCurrentUser ? "justify-end" : ""}`}
            >
              <span>{formatMessageTime(message?.updatedAt)}</span>
              {isCurrentUser && (
                <div className="flex items-center">
                  {message.isRead ? <CheckCheck className="h-3 w-3 text-blue-500" /> : <Check className="h-3 w-3" />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-4"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {dragActive && (
        <div className="fixed inset-0 bg-primary/20 border-2 border-dashed border-primary flex items-center justify-center z-50">
          <div className="text-center">
            <Paperclip className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-semibold">Drop files here to share</p>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
