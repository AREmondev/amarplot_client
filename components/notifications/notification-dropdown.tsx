"use client";

import React from "react";
import {
  Bell,
  User,
  Heart,
  Plus,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
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
import { useNotifications } from "@/hooks/use-notifications";
import { Notification } from "@/types/notification";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface NotificationDropdownProps {
  userId?: string;
  token?: string;
  className?: string;
}

// Icon mapping for notification types
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "follow":
      return <User className="h-4 w-4 text-primary-foreground" />;
    case "save":
      return <Heart className="h-4 w-4 text-destructive-foreground" />;
    case "post":
      return <Plus className="h-4 w-4 text-secondary-foreground" />;
    case "message":
      return <MessageSquare className="h-4 w-4 text-blue-600" />;
    case "alert":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
};

// Background color mapping for notification types
const getNotificationBgColor = (type: string) => {
  switch (type) {
    case "follow":
      return "bg-primary";
    case "save":
      return "bg-destructive";
    case "post":
      return "bg-secondary";
    case "message":
      return "bg-blue-500";
    case "alert":
      return "bg-orange-500";
    default:
      return "bg-muted";
  }
};

const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string | number) => void;
}> = ({ notification, onMarkAsRead }) => {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <DropdownMenuItem
      className={`group p-3 cursor-pointer transition-all duration-200 border-l-2 ${
        !notification.read
          ? "bg-blue-50/50 hover:bg-blue-50/70 border-l-blue-500 dark:bg-blue-950/20 dark:hover:bg-blue-950/30"
          : "hover:bg-secondary/30 border-l-transparent"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3 w-full">
        {/* Icon */}
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            notification.bgColor || getNotificationBgColor(notification.type)
          } ${
            !notification.read ? "ring-2 ring-blue-200 dark:ring-blue-800" : ""
          }`}
        >
          {notification.icon ? (
            <div dangerouslySetInnerHTML={{ __html: notification.icon }} />
          ) : (
            getNotificationIcon(notification.type)
          )}
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p
              className={`text-sm font-medium truncate transition-colors duration-200 ${
                !notification.read
                  ? "text-foreground group-hover:text-white"
                  : "text-muted-foreground group-hover:text-white"
              }`}
            >
              {notification.title}
            </p>
            {!notification.read && (
              <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 animate-pulse" />
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 transition-colors duration-200 group-hover:text-white">
            {notification.description}
          </p>
          <p className="text-xs text-muted-foreground mt-1 transition-colors duration-200 group-hover:text-white">
            {notification.time}
          </p>
        </div>

        {/* Right side unread indicator */}
        {!notification.read && (
          <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-2" />
        )}
      </div>
    </DropdownMenuItem>
  );
};

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  userId,
  token,
  className,
}) => {
  const { t } = useTranslation(["common", "navigation"]);
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotifications({ userId, token, enabled: !!userId && !!token });
  console.log("notifications", notifications);
  console.log("error", error);
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
          <Bell
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
            <Bell className="h-4 w-4 text-blue-500" />
            <span className="font-semibold">
              {t("navigation:header.actions.notifications")}
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
              {t("common:mark_all_read")}
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {error && (
          <div className="p-4 text-center text-sm text-red-500 bg-red-50 dark:bg-red-900/20 m-2 rounded-lg">
            <AlertTriangle className="h-5 w-5 mx-auto mb-2" />
            {error}
          </div>
        )}

        {isLoading && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              Loading notifications...
            </div>
          </div>
        )}

        {!isLoading && !error && notifications.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Bell className="h-8 w-8 text-blue-400" />
            </div>
            <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              No notifications yet
            </p>
            <p className="text-xs text-gray-500">
              We'll notify you when something important happens
            </p>
          </div>
        )}

        {!isLoading && !error && notifications.length > 0 && (
          <ScrollArea className="max-h-96">
            <div className="space-y-0 p-1">
              {notifications.slice(0, 10).map((notification, index) => (
                <div
                  key={notification._id}
                  className={
                    index < notifications.length - 1
                      ? "border-b border-gray-100 dark:border-gray-800"
                      : ""
                  }
                >
                  <NotificationItem
                    notification={notification}
                    onMarkAsRead={markAsRead}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="my-2" />
            <div className="p-2">
              <Link
                href="/notifications"
                className="group flex items-center justify-center gap-2 w-full py-3 px-4 text-sm font-medium text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              >
                <Bell className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                {t("navigation:header.dropdowns.view_all_notifications")}
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
