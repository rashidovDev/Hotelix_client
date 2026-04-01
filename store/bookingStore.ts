import { create } from "zustand";
import { RoomEntity } from "@/types";

interface BookingState {
  selectedRoom: RoomEntity | null;
  checkIn: string | null;
  checkOut: string | null;
  totalPrice: number;
  setSelectedRoom: (room: RoomEntity) => void;
  setCheckIn: (date: string) => void;
  setCheckOut: (date: string) => void;
  calculateTotalPrice: () => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  selectedRoom: null,
  checkIn: null,
  checkOut: null,
  totalPrice: 0,

  setSelectedRoom: (room) => set({ selectedRoom: room }),
  setCheckIn: (date) => set({ checkIn: date }),
  setCheckOut: (date) => set({ checkOut: date }),

  calculateTotalPrice: () => {
    const { selectedRoom, checkIn, checkOut } = get();
    if (!selectedRoom || !checkIn || !checkOut) return;

    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    set({ totalPrice: nights * selectedRoom.price });
  },

  clearBooking: () =>
    set({
      selectedRoom: null,
      checkIn: null,
      checkOut: null,
      totalPrice: 0,
    }),
}));