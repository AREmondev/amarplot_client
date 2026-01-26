import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3000";

// Data Structures (matching backend DTOs and Schemas)
export interface SendMessageDto {
  senderId: string;
  conversationId: string;
  content: string;
  type: "text" | "image" | "file" | "property";
  fileData?: {
    name: string;
    size: string;
    type: string;
    url: string;
  };
  propertyData?: {
    id: string;
    title: string;
    price: string;
    image: string;
    location: string;
  };
}

export interface Message {
  _id: string;
  senderId: string;
  conversationId: string;
  content: string;
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
    id: string;
    title: string;
    price: string;
    image: string;
    location: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const useChatSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  /**
   * Initializes and connects the Socket.IO client.
   * @param jwtToken - JWT token for authentication.
   * @param onNewMessage - Callback function to handle new incoming messages.
   * @param onHistoricalMessages - Callback function to handle historical messages when joining a conversation.
   */
  const connectSocket = useCallback(
    (
      jwtToken: string,
      onNewMessage: (message: Message) => void,
      onHistoricalMessages: (messages: Message[]) => void,
    ) => {
      if (socketRef.current) {
        console.warn(
          "Socket already connected. Disconnecting existing socket.",
        );
        socketRef.current.disconnect();
      }

      socketRef.current = io(SOCKET_SERVER_URL, {
        query: { token: jwtToken },
        transports: ["websocket", "polling"],
      });

      socketRef.current.on("connect", () => {
        console.log(
          "Socket connected successfully! ID:",
          socketRef.current?.id,
        );
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("Socket disconnected. Reason:", reason);
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message, error);
      });

      socketRef.current.on("newMessage", (message: Message) => {
        console.log("Received new message:", message);
        onNewMessage(message);
      });

      socketRef.current.on("messages", (messages: Message[]) => {
        console.log("Received historical messages:", messages);
        onHistoricalMessages(messages);
      });

      // Clean up on component unmount or re-connection
      return () => {
        if (socketRef.current) {
          socketRef.current.off("connect");
          socketRef.current.off("disconnect");
          socketRef.current.off("connect_error");
          socketRef.current.off("newMessage");
          socketRef.current.off("messages");
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    },
    [],
  );

  /**
   * Disconnects the active Socket.IO connection.
   */
  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      console.log("Disconnecting socket...");
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  /**
   * Emits a 'joinConversation' event to the backend.
   * @param conversationId - The ID of the conversation to join.
   */
  const joinConversation = useCallback((conversationId: string) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log(`Joining conversation: ${conversationId}`);
      socketRef.current.emit("joinConversation", conversationId);
    } else {
      console.warn("Socket not connected. Cannot join conversation.");
    }
  }, []);

  /**
   * Emits a 'leaveConversation' event to the backend.
   * @param conversationId - The ID of the conversation to leave.
   */
  const leaveConversation = useCallback((conversationId: string) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log(`Leaving conversation: ${conversationId}`);
      socketRef.current.emit("leaveConversation", conversationId);
    } else {
      console.warn("Socket not connected. Cannot leave conversation.");
    }
  }, []);

  /**
   * Emits a 'sendMessage' event to the backend.
   * @param payload - The message payload matching SendMessageDto.
   */
  const sendMessage = useCallback((payload: SendMessageDto) => {
    console.log("socketRef", socketRef);
    if (socketRef.current && socketRef.current.connected) {
      console.log("Sending message:", payload);
      socketRef.current.emit("sendMessage", payload);
    } else {
      console.warn("Socket not connected. Cannot send message.");
    }
  }, []);

  // Optional: A useEffect to ensure disconnection on unmount if not explicitly handled
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        console.log("Cleaning up socket on unmount.");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return {
    connectSocket,
    disconnectSocket,
    joinConversation,
    leaveConversation,
    sendMessage,
  };
};
