export const ROOM_TYPES = [
  { value: "SINGLE", label: "Single" },
  { value: "DOUBLE", label: "Double" },
  { value: "DELUXE", label: "Deluxe" },
  { value: "SUITE", label: "Suite" },
];

export const BOOKING_STATUS = {
  PENDING: { label: "Pending", color: "yellow" },
  CONFIRMED: { label: "Confirmed", color: "green" },
  CANCELLED: { label: "Cancelled", color: "red" },
};

export const USER_ROLES = {
  GUEST: "GUEST",
  HOST: "HOST",
  ADMIN: "ADMIN",
};

export const AMENITIES = [
  "WiFi",
  "Parking",
  "Pool",
  "Gym",
  "Spa",
  "Restaurant",
  "Bar",
  "Room Service",
  "Air Conditioning",
  "Pet Friendly",
];