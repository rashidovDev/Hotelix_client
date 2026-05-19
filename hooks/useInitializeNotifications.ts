"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import { mockNotifications } from "@/lib/mockNotifications";

/**
 * Hook to initialize notifications on app startup
 * Useful for loading mock data during development or real notifications in production
 */
export function useInitializeNotifications() {
  const { setNotifications, isHydrated } = useNotificationStore();

  useEffect(() => {
    if (!isHydrated) return;

    // Check if notifications have already been loaded
    const notifications = useNotificationStore.getState().notifications;
    if (notifications.length > 0) return;

    // Load mock notifications for testing/demo
    setNotifications(mockNotifications);

    // In production, you would fetch notifications from your API:
    // fetchNotificationsFromAPI().then(setNotifications);
  }, [isHydrated]); // Remove setNotifications from dependency array
}
