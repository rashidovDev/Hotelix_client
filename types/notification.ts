export enum NotificationType {
  BOOKING = 'BOOKING',
  DISCOUNT = 'DISCOUNT',
  MESSAGE = 'MESSAGE',
  PACKAGE = 'PACKAGE',
  UPDATE = 'UPDATE',
  SYSTEM = 'SYSTEM'
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  isRead: boolean;
  icon?: string;
  actionUrl?: string;
  imageUrl?: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  setNotifications: (notifications: Notification[]) => void;
  setIsHydrated: (value: boolean) => void;
  isHydrated: boolean;
}
