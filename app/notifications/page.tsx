"use client"

import { useTranslation } from 'react-i18next'
import { Bell, User, Heart, Plus, MessageSquare, AlertTriangle, Loader2, UserPlus, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import WithVerification from "@/components/common/with-verification";
import { useNotificationContext } from '@/components/providers/notification-provider'
import { Notification } from '@/types/notification'

// Icon mapping for notification types
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'follow':
      return <User className="h-4 w-4 text-primary-foreground" />;
    case 'save':
      return <Heart className="h-4 w-4 text-destructive-foreground" />;
    case 'post':
      return <Plus className="h-4 w-4 text-secondary-foreground" />;
    case 'message':
      return <MessageSquare className="h-4 w-4 text-blue-600" />;
    case 'alert':
      return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
};

// Background color mapping for notification types
const getNotificationBgColor = (type: string) => {
  switch (type) {
    case 'follow':
      return 'bg-primary';
    case 'save':
      return 'bg-destructive';
    case 'post':
      return 'bg-secondary';
    case 'message':
      return 'bg-blue-500';
    case 'alert':
      return 'bg-orange-500';
    default:
      return 'bg-muted';
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
    <li 
      className={`p-4 flex items-start gap-4 cursor-pointer transition-colors ${
        !notification.read ? 'bg-secondary/50 hover:bg-secondary/70' : 'hover:bg-secondary/30'
      }`}
      onClick={handleClick}
    >
      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        notification.bgColor || getNotificationBgColor(notification.type)
      }`}>
        {notification.icon ? (
          <div dangerouslySetInnerHTML={{ __html: notification.icon }} />
        ) : (
          getNotificationIcon(notification.type)
        )}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${
          !notification.read ? 'text-foreground' : 'text-muted-foreground'
        }`}>
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {notification.description}
        </p>
      </div>
      <div className="text-xs text-muted-foreground text-right flex flex-col items-end gap-2">
        <p>{notification.time}</p>
        {!notification.read && (
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-primary rounded-full" />
            <Badge className="text-xs">New</Badge>
          </div>
        )}
      </div>
    </li>
  );
};

export default function NotificationsPage() {
  const { t } = useTranslation(['common', 'navigation'])
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch,
  } = useNotificationContext();

  return (
    <WithVerification>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <span>{t('navigation:header.notifications')}</span>
                {unreadCount > 0 && (
                  <Badge variant="secondary">
                    {unreadCount} unread
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {error && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refetch}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Retry'
                    )}
                  </Button>
                )}
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={isLoading}
                  >
                    {t('common:mark_all_read')}
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {error && (
              <div className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                <p className="text-sm text-destructive font-medium mb-1">Failed to load notifications</p>
                <p className="text-xs text-muted-foreground mb-4">{error}</p>
                <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Try Again'
                  )}
                </Button>
              </div>
            )}
            
            {isLoading && !error && (
              <div className="p-6 text-center">
                <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Loading notifications...</p>
              </div>
            )}
            
            {!isLoading && !error && notifications.length === 0 && (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No notifications yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We'll notify you when something important happens
                </p>
                <Button variant="outline" size="sm" onClick={refetch}>
                  Refresh
                </Button>
              </div>
            )}
            
            {!isLoading && !error && notifications.length > 0 && (
              <ScrollArea className="max-h-[600px]">
                <ul className="divide-y">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                    />
                  ))}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </WithVerification>
  )
}
