import { Notification, NotificationType } from "@/types/notification";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Hotel Discount Available",
    message: "Get 30% off on luxury hotels in Bali this weekend",
    type: NotificationType.DISCOUNT,
    timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    isRead: false,
  },
  {
    id: "2",
    title: "Your Booking Confirmed",
    message: "Your booking at Sunset Resort for May 15-18 has been confirmed",
    type: NotificationType.BOOKING,
    timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    isRead: false,
  },
  {
    id: "3",
    title: "Travel Agent Reply",
    message: "Sarah replied to your message about the Paris trip",
    type: NotificationType.MESSAGE,
    timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
    isRead: false,
  },
  {
    id: "4",
    title: "New Travel Package Added",
    message: "Explore our new 'Summer in Europe' package with exclusive deals",
    type: NotificationType.PACKAGE,
    timestamp: new Date(Date.now() - 24 * 3600000), // 1 day ago
    isRead: true,
  },
  {
    id: "5",
    title: "Hotel Update",
    message: "Your favorite hotel 'Oceanview Paradise' posted a new photo",
    type: NotificationType.UPDATE,
    timestamp: new Date(Date.now() - 2 * 24 * 3600000), // 2 days ago
    isRead: true,
  },
  {
    id: "6",
    title: "Payment Received",
    message: "We've received your payment of $450 for booking #12345",
    type: NotificationType.BOOKING,
    timestamp: new Date(Date.now() - 3 * 24 * 3600000), // 3 days ago
    isRead: true,
  },
  {
    id: "7",
    title: "Booking Cancelled",
    message: "You cancelled your booking at Mountain Resort",
    type: NotificationType.SYSTEM,
    timestamp: new Date(Date.now() - 5 * 24 * 3600000), // 5 days ago
    isRead: true,
  },
];
