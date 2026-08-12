# Real-time Notification Implementation Guide

## Backend Response Format

Your backend now supports the exact format your frontend expects. Here's the API response structure:

### GET /notification/my-notifications

**Response:**

```json
[
  {
    "id": 1,
    "type": "follow",
    "icon": "<User className=\"h-4 w-4 text-primary-foreground\" />",
    "bgColor": "bg-primary",
    "title": "New Follower",
    "description": "John Doe is now following you.",
    "time": "2 hours ago",
    "read": false
  },
  {
    "id": 2,
    "type": "save",
    "icon": "<Heart className=\"h-4 w-4 text-destructive-foreground\" />",
    "bgColor": "bg-destructive",
    "title": "Listing Saved",
    "description": "Someone saved your listing for 'Modern Apartment in Downtown'.",
    "time": "1 day ago",
    "read": false
  }
]
```

## Creating Notifications

### POST /notification

**Request Body:**

```json
{
  "type": "follow",
  "title": "New Follower",
  "description": "John Doe is now following you.",
  "icon": "<User className=\"h-4 w-4 text-primary-foreground\" />",
  "bgColor": "bg-primary",
  "payload": {
    "followerId": "user123",
    "followerName": "John Doe"
  }
}
```

## Real-time Implementation

The backend uses WebSocket (Socket.IO) for real-time notifications. Here's how it works:

### WebSocket Events

1. **Client connects and joins room:**

   ```javascript
   socket.emit("joinRoom", { userId: "user123" });
   ```

2. **Server sends real-time notifications:**

   ```javascript
   // When a new notification is created
   socket.on("newNotification", (notification) => {
     console.log("New notification:", notification);
   });
   ```

3. **Mark notification as read:**
   ```javascript
   socket.emit("markAsRead", { notificationId: "notification123" });
   ```

## Frontend Integration Guide

### 1. Install Socket.IO Client

```bash
npm install socket.io-client
```

### 2. Create Notification Hook

```typescript
// hooks/useNotifications.ts
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Notification {
  id: number;
  type: string;
  icon: string;
  bgColor: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export const useNotifications = (userId: string, token: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:3000", {
      auth: {
        token: token,
      },
    });

    setSocket(newSocket);

    // Join user room for real-time notifications
    newSocket.emit("joinRoom", { userId });

    // Listen for new notifications
    newSocket.on("newNotification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Listen for notification updates
    newSocket.on("notificationMarkedAsRead", ({ notificationId }) => {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === parseInt(notificationId)
            ? { ...notif, read: true }
            : notif,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    });

    // Fetch initial notifications
    fetchNotifications();

    return () => {
      newSocket.disconnect();
    };
  }, [userId, token]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notification/my-notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = (notificationId: string) => {
    if (socket) {
      socket.emit("markAsRead", { notificationId });
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notification/mark-all-read", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};
```

### 3. Use in Your Component

```typescript
// components/NotificationDropdown.tsx
import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

interface Props {
  userId: string;
  token: string;
}

export const NotificationDropdown: React.FC<Props> = ({ userId, token }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(userId, token);

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h3>Notifications</h3>
        <span className="unread-count">{unreadCount}</span>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead}>Mark all as read</button>
        )}
      </div>

      <div className="notification-list">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${!notification.read ? 'unread' : ''}`}
            onClick={() => !notification.read && markAsRead(notification.id.toString())}
          >
            <div className={`notification-icon ${notification.bgColor}`}>
              <div dangerouslySetInnerHTML={{ __html: notification.icon }} />
            </div>
            <div className="notification-content">
              <h4>{notification.title}</h4>
              <p>{notification.description}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 4. Creating Notifications from Backend

```typescript
// Example: When a user follows another user
@Post('follow')
async followUser(
  @Body() followDto: { targetUserId: string },
  @GetUser() user: any
) {
  // Your follow logic here...

  // Create notification
  await this.notificationService.create({
    userId: followDto.targetUserId,
    type: 'follow',
    title: 'New Follower',
    description: `${user.name} is now following you.`,
    icon: '<User className="h-4 w-4 text-primary-foreground" />',
    bgColor: 'bg-primary',
    payload: {
      followerId: user.userId,
      followerName: user.name
    }
  });

  // The notification gateway will automatically emit this to the user's room
}
```

## Available Notification Types

- **follow**: User follow notifications
- **save**: Property/listing save notifications
- **post**: Community post notifications
- **message**: Chat/direct message notifications
- **alert**: Property alert notifications

## WebSocket Connection URL

- **Development**: `http://localhost:3000`
- **Production**: Your deployed backend URL

The backend is now fully configured for real-time notifications that match your frontend data structure!
