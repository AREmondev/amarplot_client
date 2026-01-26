"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { Notification } from "@/types/notification";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (notificationId: string | number) => void;
  markAllAsRead: () => void;
  refetch: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const { data: session } = useSession();
  const [showToasts, setShowToasts] = useState(true);

  const userId = session?.user?.id;
  const token = session?.user?.token;

  const notificationHook = useNotifications({
    userId,
    token,
    enabled: !!userId && !!token,
  });

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch,
  } = notificationHook;

  // Show toast notifications for new notifications
  useEffect(() => {
    if (!showToasts || notifications.length === 0) return;
    console.log("Notificatoins", notifications);
    // Get the latest unread notification
    const latestNotification = notifications.find((n) => !n.read);

    if (latestNotification && notifications.length > 0) {
      // Only show toast for very recent notifications (to avoid spam on initial load)
      const notificationTime = new Date(latestNotification.time);
      const now = new Date();
      const timeDiff = now.getTime() - notificationTime.getTime();

      // Show toast only if notification is less than 5 minutes old
      if (timeDiff < 5 * 60 * 1000) {
        toast(latestNotification.title, {
          description: latestNotification.description,
          action: {
            label: "View",
            onClick: () => {
              markAsRead(latestNotification.id);
              // Optionally navigate to notifications page
              window.location.href = "/notifications";
            },
          },
          duration: 5000,
        });
      }
    }
  }, [notifications, showToasts, markAsRead]);

  // Disable toast notifications after initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToasts(false);
    }, 2000); // Disable toasts after 2 seconds of initial load

    return () => clearTimeout(timer);
  }, []);

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  console.log("context", context);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
};

export default NotificationProvider;
