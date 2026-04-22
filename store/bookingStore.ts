import { create } from "zustand";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { RoomEntity } from "@/types";

interface BookingState {
  selectedRoom: RoomEntity | null;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  totalPrice: number;
  setSelectedRoom: (room: RoomEntity) => void;
  setCheckIn: (date: string | null) => void;
  setCheckOut: (date: string | null) => void;
  setGuests: (guests: number) => void;
  calculateTotalPrice: () => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  selectedRoom: null,
  checkIn: null,
  checkOut: null,
  guests: 1,
  totalPrice: 0,

  setSelectedRoom: (room) => set({ selectedRoom: room }),
  setCheckIn: (date) => set({ checkIn: date }),
  setCheckOut: (date) => set({ checkOut: date }),
  setGuests: (guests) => set({ guests }),

  calculateTotalPrice: () => {
    const { selectedRoom, checkIn, checkOut } = get();
    if (!selectedRoom || !checkIn || !checkOut) return;

    const nights = differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));

    if (nights <= 0) {
      set({ totalPrice: 0 });
      return;
    }

    set({ totalPrice: nights * selectedRoom.price });
  },

  clearBooking: () =>
    set({
      selectedRoom: null,
      checkIn: null,
      checkOut: null,
      guests: 1,
      totalPrice: 0,
    }),
}));