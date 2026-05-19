"use client";

import React, { useMemo } from "react";
import { Notification, NotificationType } from "@/types/notification";
import { Bell, AlertCircle, MessageCircle, Gift, Star, CheckCircle, X } from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.BOOKING:
      return CheckCircle;
    case NotificationType.DISCOUNT:
      return Gift;
    case NotificationType.MESSAGE:
      return MessageCircle;
    case NotificationType.PACKAGE:
      return Star;
    case NotificationType.UPDATE:
      return Bell;
    case NotificationType.SYSTEM:
      return AlertCircle;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.BOOKING:
      return "bg-green-50 text-green-600";
    case NotificationType.DISCOUNT:
      return "bg-purple-50 text-purple-600";
    case NotificationType.MESSAGE:
      return "bg-blue-50 text-blue-600";
    case NotificationType.PACKAGE:
      return "bg-orange-50 text-orange-600";
    case NotificationType.UPDATE:
      return "bg-indigo-50 text-indigo-600";
    case NotificationType.SYSTEM:
      return "bg-red-50 text-red-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return new Date(date).toLocaleDateString();
};

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const IconComponent = getNotificationIcon(notification.type);
  const colorClasses = getNotificationColor(notification.type);

  // Memoize formatted time to prevent constant recalculation
  const formattedTime = useMemo(
    () => formatTime(notification.timestamp),
    [notification.timestamp]
  );

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex gap-3 p-4 border-b border-slate-100 cursor-pointer transition-all duration-200 ${
        !notification.isRead
          ? "bg-blue-50 hover:bg-blue-100"
          : "bg-white hover:bg-slate-50"
      }`}
    >
      {/* Unread indicator dot */}
      {!notification.isRead && (
        <div className="absolute top-4 left-3 h-2 w-2 bg-blue-600 rounded-full flex-shrink-0" />
      )}

      {/* Icon */}
      <div className={`mt-1 p-2 rounded-lg flex-shrink-0 ${colorClasses}`}>
        <IconComponent className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold text-slate-900 truncate ${
            !notification.isRead ? "font-bold" : ""
          }`}
        >
          {notification.title}
        </p>
        <p className="text-sm text-slate-600 line-clamp-2 mt-0.5">
          {notification.message}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {formattedTime}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors flex-shrink-0 mt-1"
        aria-label="Delete notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
