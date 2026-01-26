export interface Notification {
  id: number;
  type: 'follow' | 'save' | 'post' | 'message' | 'alert';
  icon: string;
  bgColor: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  payload?: Record<string, any>;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

export interface CreateNotificationRequest {
  type: string;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  payload?: Record<string, any>;
}