import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Notification, NotificationState, NotificationType } from "@/types/notification";

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      isHydrated: false,

      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: `notif-${Date.now()}-${Math.random()}`,
          isRead: false,
          timestamp: new Date(),
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (notificationId: string) => {
        set((state) => {
          const updatedNotifications = state.notifications.map((notif) =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          );

          const unreadCount = updatedNotifications.filter(
            (notif) => !notif.isRead
          ).length;

          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({
            ...notif,
            isRead: true,
          })),
          unreadCount: 0,
        }));
      },

      deleteNotification: (notificationId: string) => {
        set((state) => ({
          notifications: state.notifications.filter(
            (notif) => notif.id !== notificationId
          ),
          unreadCount: state.notifications.filter(
            (notif) => notif.id !== notificationId && !notif.isRead
          ).length,
        }));
      },

      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },

      setNotifications: (notifications: Notification[]) => {
        const unreadCount = notifications.filter(
          (notif) => !notif.isRead
        ).length;
        set({
          notifications,
          unreadCount,
        });
      },

      setIsHydrated: (value: boolean) => {
        set({ isHydrated: value });
      },
    }),
    {
      name: "hotelix-notifications",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
        return state;
      },
    }
  )
);
