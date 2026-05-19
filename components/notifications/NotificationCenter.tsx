"use client";

import React, { useState } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import { NotificationItem } from "./NotificationItem";
import { Bell, Trash2, Filter } from "lucide-react";

type FilterType = "all" | "unread" | "read";

export function NotificationCenter() {
  const [filter, setFilter] = useState<FilterType>("all");
  const { notifications, markAsRead, deleteNotification, clearAllNotifications, markAllAsRead } =
    useNotificationStore();

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.isRead;
    if (filter === "read") return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
              <p className="text-slate-600 mt-1">
                Stay updated with your travel activity
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600">Total</p>
            <p className="text-2xl font-bold text-slate-900">{notifications.length}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 shadow-sm">
            <p className="text-sm text-blue-600">Unread</p>
            <p className="text-2xl font-bold text-blue-700">{unreadCount}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-600">Read</p>
            <p className="text-2xl font-bold text-slate-900">
              {notifications.length - unreadCount}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        {notifications.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex gap-2 flex-wrap">
              {(["all", "unread", "read"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filter === f
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Filter className="w-4 h-4 inline mr-1" />
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="ml-auto flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 rounded-lg font-medium text-sm bg-white text-slate-700 border border-slate-200 hover:border-slate-300 transition-all"
                >
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="px-4 py-2 rounded-lg font-medium text-sm bg-red-50 text-red-600 border border-red-200 hover:border-red-300 transition-all"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <div className="flex justify-center mb-4">
              <Bell className="w-12 h-12 text-slate-300" />
            </div>
            <p className="text-lg font-semibold text-slate-600 mb-2">
              {filter === "unread"
                ? "No unread notifications"
                : filter === "read"
                  ? "No read notifications"
                  : "No notifications yet"}
            </p>
            <p className="text-slate-500">
              {filter === "unread"
                ? "You're all caught up! Check back later for updates."
                : "Start exploring to get notifications about your bookings and travel activity."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
