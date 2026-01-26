"use client";

import { useEffect, useState, useCallback } from "react";
import { getSocket, connectSocket, disconnectSocket } from "@/lib/socket";
import { Notification } from "@/types/notification";
import { Socket } from "socket.io-client";
import { notificationServices } from "@/lib/api/notification";

interface UseNotificationsProps {
  userId?: string;
  token?: string;
  enabled?: boolean;
}

export const useNotifications = ({
  userId,
  token,
  enabled = true,
}: UseNotificationsProps = {}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    console.log("Fetch notifications", userId, token, enabled);
    if (!token || !enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await notificationServices.getMyNotifications();
      const data = response.data;
      console.log("Notificatoin from api", data);
      setNotifications(data.data);
      setUnreadCount(data.data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch notifications"
      );
    } finally {
      setIsLoading(false);
    }
  }, [token, enabled]);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId: string | number) => {
      const id =
        typeof notificationId === "string"
          ? parseInt(notificationId)
          : notificationId;

      // Optimistic update
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Emit to socket if available
      if (socket?.connected) {
        socket.emit("markAsRead", { notificationId: id.toString() });
      }

      try {
        await notificationServices.markAsRead(id.toString());
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
        // Revert optimistic update on error
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id ? { ...notif, read: false } : notif
          )
        );
        setUnreadCount((prev) => prev + 1);
      }
    },
    [socket]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter((n) => !n.read);

    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      console.log("unreadNotifications", unreadNotifications);
      const response = await notificationServices.markAllAsRead();
      console.log("Mark all notifications as read response", response);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      // Revert optimistic update on error
      setNotifications((prev) =>
        prev.map((n) => {
          const wasUnread = unreadNotifications.find((un) => un.id === n.id);
          return wasUnread ? { ...n, read: false } : n;
        })
      );
      setUnreadCount(unreadNotifications.length);
    }
  }, [notifications]);

  // Initialize socket connection and event listeners
  useEffect(() => {
    if (!enabled || !token || !userId) return;

    try {
      const socketInstance = getSocket(token);
      setSocket(socketInstance);
      connectSocket(token);

      socketInstance.on("connect", () => {
        console.log("Connected to notification socket");
        socketInstance.emit("joinRoom", { userId });
      });

      socketInstance.on("newNotification", (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      socketInstance.on(
        "notificationMarkedAsRead",
        ({ notificationId }: { notificationId: string }) => {
          setNotifications((prev) =>
            prev.map((notif) =>
              notif.id === parseInt(notificationId)
                ? { ...notif, read: true }
                : notif
            )
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
      );

      socketInstance.on("allNotificationsMarkedAsRead", () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      });

      socketInstance.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        console.warn(
          "Real-time notifications unavailable, falling back to polling"
        );
        // Don't set error state for connection issues, just log them
        // setError("Failed to connect to real-time notifications");
      });

      fetchNotifications();

      return () => {
        socketInstance.off("connect");
        socketInstance.off("newNotification");
        socketInstance.off("notificationMarkedAsRead");
        socketInstance.off("allNotificationsMarkedAsRead");
        socketInstance.off("connect_error");
      };
    } catch (error) {
      console.error("Failed to initialize notifications:", error);
      setError("Failed to initialize notifications");
      fetchNotifications();
    }
  }, [userId, token, enabled, fetchNotifications]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        disconnectSocket();
      }
    };
  }, [socket]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};
