import { create } from "zustand";

interface SearchState {
  city: string;
  country: string;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  setCity: (city: string) => void;
  setCountry: (country: string) => void;
  setCheckIn: (date: string) => void;
  setCheckOut: (date: string) => void;
  setGuests: (guests: number) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  city: "",
  country: "",
  checkIn: null,
  checkOut: null,
  guests: 1,

  setCity: (city) => set({ city }),
  setCountry: (country) => set({ country }),
  setCheckIn: (date) => set({ checkIn: date }),
  setCheckOut: (date) => set({ checkOut: date }),
  setGuests: (guests) => set({ guests }),
  clearSearch: () =>
    set({
      city: "",
      country: "",
      checkIn: null,
      checkOut: null,
      guests: 1,
    }),
}));