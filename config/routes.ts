export const routes = {
  // Public
  home: "/",
  search: "/search",
  hotel: (id: string) => `/hotels/${id}`,
  about: "/about",
  guides: "/guides",
  contact: "/contact",
  destinations: "/destinations",

  // Booking
  book: (id: string) => `/book/${id}`,

  // Auth
  login: "/auth/login",
  register: "/auth/register",

  // Dashboard (GUEST + HOST)
  dashboard: "/dashboard",
  dashboardProfile: "/dashboard/profile",
  dashboardBookings: "/dashboard/bookings",
  dashboardReviews: "/dashboard/reviews",
  dashboardHotels: "/dashboard/hotels",

  // Admin (separate UI)
  admin: "/admin",
};