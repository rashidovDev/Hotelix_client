export const routes = {
  // Public
  home: "/",
  search: "/search",
  hotels: "/hotels",
  hotel: (id: string) => `/hotels/${id}`,
  subscriptions: "/subscriptions",
  about: "/about",
  guides: "/guides",
  contact: "/contact",
  destinations: "/destinations",

  // Auth
  login: "/auth/login",
  register: "/auth/register",

  // Dashboard (GUEST + HOST)
  dashboard: "/dashboard",
  dashboardProfile: "/dashboard/profile",
  dashboardBookings: "/dashboard/bookings",
  dashboardReviews: "/dashboard/reviews",
  dashboardHotels: "/dashboard/hotels",
  dashboardHotelsNew: "/dashboard/hotels/new",
  dashboardHotelEdit: (id: string) => `/dashboard/hotels/${id}/edit`,
  dashboardHotelRooms: (id: string) => `/dashboard/hotels/${id}/rooms`,

  // Admin (separate UI)
  admin: "/admin",
};