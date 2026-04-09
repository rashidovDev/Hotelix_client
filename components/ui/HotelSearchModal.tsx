"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Globe,
  Info,
  MapPin,
  Minus,
  Plus,
  Search,
  Star,
  Users,
  X,
} from "lucide-react";
import { routes } from "@/config/routes";
import { useSearchStore } from "@/store/searchStore";

type ModalPanel = "dates" | "guests" | null;

interface HotelSearchModalProps {
  open: boolean;
  onClose: () => void;
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function formatShortDate(date: Date) {
  return `${MONTH_LABELS[date.getMonth()]} ${date.getDate()}`;
}

function formatDateInput(date: Date) {
  return date.toISOString().split("T")[0];
}

function nightsBetween(start: Date | null, end: Date | null) {
  if (!start || !end) return 0;
  const diff = startOfDay(end).getTime() - startOfDay(start).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function buildMonthGrid(viewMonth: Date) {
  const firstDay = startOfMonth(viewMonth);
  const year = firstDay.getFullYear();
  const month = firstDay.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingDays = firstDay.getDay();

  const cells: Array<Date | null> = [];

  for (let index = 0; index < leadingDays; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks: Array<Array<Date | null>> = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  return {
    title: `${MONTH_LABELS[month]} ${year}`,
    weeks,
  };
}

export default function HotelSearchModal({ open, onClose }: HotelSearchModalProps) {
  const router = useRouter();
  const { city, setCity, setCheckIn, setCheckOut, setGuests } = useSearchStore();

  const [location, setLocation] = useState(city);
  const [checkIn, setCheckInDate] = useState<Date | null>(null);
  const [checkOut, setCheckOutDate] = useState<Date | null>(null);
  const [roomCount, setRoomCount] = useState(1);
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);
  const [workTrip, setWorkTrip] = useState(false);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [activePanel, setActivePanel] = useState<ModalPanel>(null);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));

  const currentMonth = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);
  const nextMonth = useMemo(() => buildMonthGrid(addMonths(visibleMonth, 1)), [visibleMonth]);
  const nights = nightsBetween(checkIn, checkOut);

  useEffect(() => {
    if (!open) {
      setActivePanel(null);
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const dateLabel = checkIn ? formatShortDate(checkIn) : "Select date";
  const checkoutLabel = checkOut ? formatShortDate(checkOut) : "Select date";

  const handleDateClick = (date: Date) => {
    const clicked = startOfDay(date);

    if (!checkIn || (checkIn && checkOut) || clicked < startOfDay(checkIn)) {
      setCheckInDate(clicked);
      setCheckOutDate(null);
      return;
    }

    if (clicked.getTime() === startOfDay(checkIn).getTime()) {
      setCheckOutDate(null);
      return;
    }

    setCheckOutDate(clicked);
  };

  const isInRange = (date: Date) => {
    if (!checkIn || !checkOut) return false;

    const value = startOfDay(date).getTime();
    return value > startOfDay(checkIn).getTime() && value < startOfDay(checkOut).getTime();
  };

  const isSelected = (date: Date | null) => {
    if (!date) return false;

    const value = startOfDay(date).getTime();
    return value === startOfDay(checkIn ?? new Date(0)).getTime() || value === startOfDay(checkOut ?? new Date(0)).getTime();
  };

  const toggleStar = (star: number) => {
    setSelectedStars((current) =>
      current.includes(star)
        ? current.filter((item) => item !== star)
        : [...current, star].sort((left, right) => left - right)
    );
  };

  const closeModal = () => {
    onClose();
  };

  const handleSearch = () => {
    const trimmedLocation = location.trim();

    if (trimmedLocation) {
      setCity(trimmedLocation);
    }
 
    if (checkIn) {
      setCheckIn(formatDateInput(checkIn));
    }

    if (checkOut) {
      setCheckOut(formatDateInput(checkOut));
    }

    setGuests(adultCount + childCount);

    const params = new URLSearchParams();

    if (trimmedLocation) params.set("city", trimmedLocation);
    if (checkIn) params.set("checkIn", formatDateInput(checkIn));
    if (checkOut) params.set("checkOut", formatDateInput(checkOut));
    params.set("rooms", String(roomCount));
    params.set("adults", String(adultCount));
    params.set("children", String(childCount));

    if (workTrip) params.set("workTrip", "true");
    if (selectedStars.length > 0) params.set("stars", selectedStars.join(","));

    router.push(`${routes.search}?${params.toString()}`);
    closeModal();
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:items-center"
      onClick={closeModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Hotel search modal"
        className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Hotel search
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              Where are you going?
            </h2>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[82vh] overflow-y-auto p-4 sm:p-6">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_1.5fr_1fr_auto] lg:gap-0">
            <label className="group flex items-center gap-3 rounded-2xl px-4 py-4 text-left transition-all hover:bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500/40 lg:rounded-r-none lg:px-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                <MapPin className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Location
                </span>
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Where to?"
                  className="mt-1 w-full bg-transparent text-base font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </span>
            </label>

            <button
              type="button"
              onClick={() => setActivePanel((current) => (current === "dates" ? null : "dates"))}
              className="group flex items-start gap-3 rounded-2xl px-4 py-4 text-left transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 lg:rounded-none lg:px-5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                <CalendarDays className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Dates
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-2 text-base font-medium text-slate-900">
                  <span>{dateLabel}</span>
                  <span className="text-slate-400">-</span>
                  <span>{checkoutLabel}</span>
                </span>
                <span className="mt-1 block text-sm text-slate-500">{nights} nights</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActivePanel((current) => (current === "guests" ? null : "guests"))}
              className="group flex items-center gap-3 rounded-2xl px-4 py-4 text-left transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 lg:rounded-none lg:px-5"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
                <Users className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Guests
                </span>
                <span className="block text-base font-medium text-slate-900">
                  {roomCount} room, {adultCount} adults, {childCount} children
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 lg:min-w-35"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>

          {activePanel === "dates" ? (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
              <div className="grid gap-4 lg:grid-cols-2">
                {[currentMonth, nextMonth].map((month, monthIndex) => (
                  <div key={month.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
                        className={`rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 ${
                          monthIndex === 1 ? "invisible" : ""
                        }`}
                        aria-label="Previous month"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <h3 className="text-sm font-semibold text-slate-900">{month.title}</h3>
                      <button
                        type="button"
                        onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
                        className={`rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 ${
                          monthIndex === 0 ? "invisible" : ""
                        }`}
                        aria-label="Next month"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
                      {WEEK_DAYS.map((day) => (
                        <span key={day} className="py-1">
                          {day}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2 grid grid-cols-7 gap-1">
                      {month.weeks.flat().map((date, index) => {
                        if (!date) {
                          return <span key={`empty-${index}`} className="h-10 rounded-lg" />;
                        }

                        const selected = isSelected(date);
                        const range = isInRange(date);

                        return (
                          <button
                            key={date.toISOString()}
                            type="button"
                            onClick={() => handleDateClick(date)}
                            className={`h-10 rounded-lg text-sm font-medium transition-all ${
                              selected
                                ? "bg-blue-600 text-white shadow-sm"
                                : range
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-white text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activePanel === "guests" ? (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    label: "Rooms",
                    value: roomCount,
                    decrease: () => setRoomCount((current) => Math.max(1, current - 1)),
                    increase: () => setRoomCount((current) => current + 1),
                  },
                  {
                    label: "Adults",
                    value: adultCount,
                    decrease: () => setAdultCount((current) => Math.max(1, current - 1)),
                    increase: () => setAdultCount((current) => current + 1),
                  },
                  {
                    label: "Children",
                    value: childCount,
                    decrease: () => setChildCount((current) => Math.max(0, current - 1)),
                    increase: () => setChildCount((current) => current + 1),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">Choose how many</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={item.decrease}
                        className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={item.value === 1 && item.label !== "Children"}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-8 text-center text-base font-semibold text-slate-900">
                        {item.value}
                      </span>
                      <button
                        type="button"
                        onClick={item.increase}
                        className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={workTrip}
                onChange={(event) => setWorkTrip(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="inline-flex items-center gap-2">
                I&apos;m traveling for work
                <Info className="h-4 w-4 text-slate-400" />
              </span>
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <span className="text-sm font-semibold text-slate-700">Star Rating</span>
              <div className="flex flex-wrap gap-2">
                {[2, 3, 4, 5].map((rating) => {
                  const isActive = selectedStars.includes(rating);

                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => toggleStar(rating)}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-2 text-sm font-medium shadow-sm transition-all ${
                        isActive
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {rating === 2 ? "≤ 2★" : `${rating}★`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
            <Globe className="h-4 w-4" />
            Built as a separate modal component, leaving AIInput unchanged.
          </div>
        </div>
      </div>
    </div>
  );
}
