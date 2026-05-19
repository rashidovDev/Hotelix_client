"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useNotificationStore } from "@/store/notificationStore";
import { routes } from "@/config/routes";
import { NotificationItem } from "./NotificationItem";
import { Bell, Check } from "lucide-react";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [mounted, setMounted] = useState(false);
  const {
    notifications,
    unreadCount,
    isHydrated,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!mounted || !isHydrated) {
    return null;
  }

  const hasNotifications = notifications.length > 0;

  // Only render if open or opening
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay - No blur for better performance */}
      <div
        className="fixed inset-0 z-30 bg-black/5"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-1rem)] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 origin-top-right z-40 opacity-100 scale-100 pointer-events-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-900" />
            <h2 className="text-base font-semibold text-slate-900">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 text-xs font-bold text-white bg-blue-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          {hasNotifications && unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              title="Mark all as read"
            >
              <Check className="w-4 h-4" />
              Mark all
            </button>
          )}
        </div>

        {/* Content */}
        <div className="max-h-[500px] overflow-y-auto">
          {!hasNotifications ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="p-3 bg-slate-100 rounded-full mb-3">
                <Bell className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600 text-center">
                No notifications yet
              </p>
              <p className="text-xs text-slate-500 text-center mt-1">
                Check back later for updates on your bookings and travel
                adventures
              </p>
            </div>
          ) : (
            /* Notifications List */
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {hasNotifications && (
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 text-center">
            <Link
              href={routes.notifications}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              View all notifications
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
