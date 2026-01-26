import React, { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Paperclip, Smile, Send, ImageIcon, X } from "lucide-react";
import { useChatStore } from "@/lib/store/chatStore";
import { SendMessageDto } from "@/hooks/use-chat-socket";
import { Badge } from "@/components/ui/badge";

interface MessageInputProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  sendMessage: (payload: SendMessageDto) => void;
}

type LocalPendingFile = {
  _id: string;
  file: File;
  url: string;
  type: "image" | "file";
  name: string;
  size: string;
};

export default function MessageInput({
  fileInputRef,
  sendMessage,
}: MessageInputProps) {
  const {
    newMessage,
    setNewMessage,
    pendingFiles,
    setPendingFiles,
    showEmojiPicker,
    setShowEmojiPicker,
    emojis,
    selectedConversation,
    currentUser,
    uploadFile,
    isConnected,
  } = useChatStore();

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const pendingFile: LocalPendingFile = {
        _id: `pending-${Date.now()}-${Math.random()}`,
        file,
        url,
        type: file.type.startsWith("image/") ? "image" : "file",
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      };
      setPendingFiles([...pendingFiles, pendingFile]);
    });
  };

  const removePendingFile = (fileId: string) => {
    setPendingFiles(pendingFiles.filter((f) => f._id !== fileId));
  };

  const handleSendMessage = async () => {
    console.log("selectedConversation", selectedConversation);
    console.log("newMessage", newMessage);
    if (
      !selectedConversation ||
      (!newMessage.trim() && pendingFiles.length === 0)
    )
      return;

    if (newMessage.trim()) {
      const messagePayload: SendMessageDto = {
        conversationId: selectedConversation._id,
        senderId: currentUser?._id || "",
        content: newMessage,
        type: "text",
      };
      sendMessage(messagePayload);
    }

    if (pendingFiles.length > 0) {
      for (const pendingFile of pendingFiles) {
        try {
          const formData = new FormData();
          formData.append("file", pendingFile.file);
          const uploadedFile = await uploadFile(formData);

          const fileMessagePayload: SendMessageDto = {
            conversationId: selectedConversation._id,
            senderId: currentUser?._id || "",
            content: `Shared ${pendingFile.type === "image" ? "an image" : "a file"}`,
            type: pendingFile.type,
            fileData: {
              name: pendingFile.name,
              size: pendingFile.size,
              type: pendingFile.file.type,
              url: uploadedFile.url,
            },
          };
          sendMessage(fileMessagePayload);
        } catch (error) {
          console.error("Failed to upload file or send message:", error);
        }
      }
      setPendingFiles([]);
    }

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(newMessage + emoji);
    setShowEmojiPicker(false);
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf"))
      return <Paperclip className="h-8 w-8 text-red-500" />;
    if (type.includes("image"))
      return <ImageIcon className="h-8 w-8 text-green-500" />;
    return <Paperclip className="h-8 w-8 text-gray-500" />;
  };

  return (
    <div className="p-4 border-t bg-card">
      {pendingFiles.length > 0 && (
        <div className="p-3 border-b bg-muted/30 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Files to send:</span>
            <Badge variant="secondary">{pendingFiles.length}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {pendingFiles.map((file) => (
              <div key={file._id} className="relative group">
                {file.type === "image" ? (
                  <div className="relative">
                    <Image
                      src={file.url || "/placeholder.svg"}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                      width={64}
                      height={64}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePendingFile(file._id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-background rounded-lg border min-w-[120px]">
                    {getFileIcon(file.file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file.size}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePendingFile(file._id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.multiple = true;
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              handleFileSelect(target.files);
            };
            input.click();
          }}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid grid-cols-5 gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="p-2 hover:bg-muted rounded text-2xl"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Button
          onClick={handleSendMessage}
          disabled={
            (!newMessage.trim() && pendingFiles.length === 0) || !isConnected
          }
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />
    </div>
  );
}
