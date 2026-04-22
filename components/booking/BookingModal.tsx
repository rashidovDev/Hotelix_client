"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import RoomBookingPanel from "@/components/booking/RoomBookingPanel";
import { HotelEntity, RoomEntity } from "@/types";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  room: RoomEntity | null;
  hotel: HotelEntity | null;
}

export default function BookingModal({ open, onClose, room, hotel }: BookingModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open || !room) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Book ${room.name}`}
        className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Reserve room</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">{room.name}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {hotel?.name}
              {hotel?.location ? ` • ${hotel.location}` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close booking modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[82vh] overflow-y-auto p-5">
          <RoomBookingPanel
            room={room}
            hotelName={hotel?.name}
            hotelLocation={hotel?.location}
          />
        </div>
      </div>
    </div>
  );
}