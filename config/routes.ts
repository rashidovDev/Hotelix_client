export const routes = {
  // Public
  home: "/",
  search: "/search",
  hotel: (id: string) => `/hotels/${id}`,

  // Booking
  book: (id: string) => `/book/${id}`,
  bookingConfirmation: (id: string) => `/booking/confirmation/${id}`,

  // Auth
  login: "/auth/login",
  register: "/auth/register",

  // Protected
  dashboard: "/dashboard",
  dashboardBookings: "/dashboard/bookings",
  dashboardProfile: "/dashboard/profile",
  dashboardReviews: "/dashboard/reviews",

  // Admin / Host
  admin: "/admin",
  adminHotels: "/admin/hotels",
  adminHotelCreate: "/admin/hotels/create",
  adminHotelEdit: (id: string) => `/admin/hotels/${id}/edit`,
  adminRooms: (hotelId: string) => `/admin/hotels/${hotelId}/rooms`,
  adminRoomCreate: (hotelId: string) => `/admin/hotels/${hotelId}/rooms/create`,
};