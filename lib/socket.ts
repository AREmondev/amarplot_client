
import { io, Socket } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3000";

let socket: Socket;

export const getSocket = (token?: string): Socket => {
  if (!socket) {
    socket = io(URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: false,
      transports: ['websocket', 'polling'],
      upgrade: true,
      auth: {
        token: token,
      },
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server at", URL);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket server:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err.message);
      console.error("Error details:", err);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("Reconnected to WebSocket server after", attemptNumber, "attempts");
    });

    socket.on("reconnect_error", (err) => {
      console.error("WebSocket reconnection error:", err.message);
    });

    socket.on("reconnect_failed", () => {
      console.error("Failed to reconnect to WebSocket server after maximum attempts");
    });
  }
  return socket;
};

export const connectSocket = (token: string) => {
  const socket = getSocket(token);
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

