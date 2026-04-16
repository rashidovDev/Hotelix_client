"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Minus,
  Plus,
  Users,
  X,
} from "lucide-react";
import { routes } from "@/config/routes";
import { useSearchStore } from "@/store/searchStore";

type Panel = "dates" | "guests" | null;

type ChildAge = "<1" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const CHILD_AGE_OPTIONS: ChildAge[] = ["<1", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17"];
const BLUE = "#4F8EF7";
const LIGHT_BLUE = "#EEF4FF";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function formatShortDate(date: Date) {
  return `${date.toLocaleDateString("en-US", { weekday: "short" })}, ${MONTH_LABELS[date.getMonth()]} ${date.getDate()}`;
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

function isPastDate(date: Date, today: Date) {
  return startOfDay(date).getTime() < startOfDay(today).getTime();
}

function createChildAgeList(count: number, ages: ChildAge[]) {
  const nextAges = [...ages];

  while (nextAges.length < count) {
    nextAges.push("<1");
  }

  return nextAges.slice(0, count);
}

export default function AIInput() {
  const router = useRouter();
  const { city, setCity, setCheckIn, setCheckOut, setGuests } = useSearchStore();

  const [location, setLocation] = useState(city);
  const [checkIn, setCheckInDate] = useState<Date | null>(null);
  const [checkOut, setCheckOutDate] = useState<Date | null>(null);
  const [roomCount, setRoomCount] = useState(1);
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);
  const [childAges, setChildAges] = useState<ChildAge[]>([]);
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));

  const today = useMemo(() => startOfDay(new Date()), []);
  const currentMonth = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);
  const nextMonth = useMemo(() => buildMonthGrid(addMonths(visibleMonth, 1)), [visibleMonth]);
  const nights = nightsBetween(checkIn, checkOut);
  const checkInSummary = checkIn ? formatShortDate(checkIn) : "Add date";
  const checkOutSummary = checkOut ? formatShortDate(checkOut) : "Add date";

  useEffect(() => {
    if (!activePanel) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePanel(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [activePanel]);

  useEffect(() => {
    setChildAges((current) => createChildAgeList(childCount, current));
  }, [childCount]);

  const closePanel = () => {
    setActivePanel(null);
  };

  const openPanel = (panel: Exclude<Panel, null>) => {
    setActivePanel((current) => (current === panel ? null : panel));
  };

  const handleDateClick = (date: Date) => {
    const clicked = startOfDay(date);

    if (isPastDate(clicked, today)) return;

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

  const isRangeStart = (date: Date) => checkIn ? startOfDay(date).getTime() === startOfDay(checkIn).getTime() : false;
  const isRangeEnd = (date: Date) => checkOut ? startOfDay(date).getTime() === startOfDay(checkOut).getTime() : false;

  const isInRange = (date: Date) => {
    if (!checkIn || !checkOut) return false;
    const value = startOfDay(date).getTime();
    return value > startOfDay(checkIn).getTime() && value < startOfDay(checkOut).getTime();
  };

  const adjustCount = (kind: "rooms" | "adults" | "children", delta: number) => {
    if (kind === "rooms") {
      setRoomCount((current) => Math.min(10, Math.max(1, current + delta)));
      return;
    }

    if (kind === "adults") {
      setAdultCount((current) => Math.min(10, Math.max(1, current + delta)));
      return;
    }

    setChildCount((current) => Math.min(6, Math.max(0, current + delta)));
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

    router.push(`${routes.search}?${params.toString()}`);
    closePanel();
  };

  const roomsSummary = `${roomCount} room${roomCount > 1 ? "s" : ""}`;
  const adultsSummary = `${adultCount} adult${adultCount > 1 ? "s" : ""}`;
  const childrenSummary = `${childCount} child${childCount === 1 ? "" : "ren"}`;

  return (
    <section
      className="w-full px-4 py-8 mt-36 sm:px-6 lg:px-8"
      style={{
        ["--blue" as never]: BLUE,
        ["--light-blue" as never]: LIGHT_BLUE,
      } as React.CSSProperties}
    >
      <div className="mx-auto max-w-7xl">
        <h1 className="text-center text-5xl text-white mb-5">Book your stay with Hotelix</h1>
        <div className="w-full rounded-full bg-white px-4 py-3 shadow-md transition-all duration-200 sm:px-5 md:px-6 md:py-4">
          <div className="flex flex-col gap-2 md:h-16 md:flex-row md:items-center md:gap-0">
            <div className="flex min-w-0 flex-1 items-stretch">
              <div className="group relative flex flex-1 cursor-pointer flex-col justify-center rounded-none px-4 py-3 transition-all duration-200 hover:bg-gray-50 focus-within:scale-[1.02] focus-within:bg-gray-100 md:border-r md:border-gray-200">
                <label className="text-xs font-medium text-gray-500">Location</label>
                <div className="mt-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Copenhagen, Denmark"
                    className="w-full bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>

                {location.trim() ? (
                  <button
                    type="button"
                    onClick={() => setLocation("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                    aria-label="Clear destination"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => openPanel("dates")}
                className={`flex flex-1 cursor-pointer flex-col justify-center rounded-none px-4 py-3 text-left transition-all duration-200 hover:bg-gray-50 md:border-r md:border-gray-200 ${activePanel === "dates" ? "bg-gray-100 scale-[1.02]" : ""}`}
              >
                <span className="text-xs font-medium text-gray-500">Check-in</span>
                <span className="mt-1 truncate text-sm font-semibold text-gray-800">{checkInSummary}</span>
              </button>

              <button
                type="button"
                onClick={() => openPanel("dates")}
                className={`flex flex-1 cursor-pointer flex-col justify-center rounded-none px-4 py-3 text-left transition-all duration-200 hover:bg-gray-50 md:border-r md:border-gray-200 ${activePanel === "dates" ? "bg-gray-100 scale-[1.02]" : ""}`}
              >
                <span className="text-xs font-medium text-gray-500">Check-out</span>
                <span className="mt-1 truncate text-sm font-semibold text-gray-800">{checkOutSummary}</span>
              </button>

              <button
                type="button"
                onClick={() => openPanel("guests")}
                className={`flex flex-1 cursor-pointer flex-col justify-center rounded-full px-4 py-3 text-left transition-all duration-200 hover:bg-gray-50 ${activePanel === "guests" ? "bg-gray-100 scale-[1.02]" : ""}`}
              >
                <span className="text-xs font-medium text-gray-500">Guests</span>
                <span className="mt-1 truncate text-sm font-semibold text-gray-800">
                  {roomsSummary}, {adultsSummary}, {childrenSummary}
                </span>
              </button>
            </div>

            <div className="flex justify-end md:ml-2 md:border-l md:border-gray-200 md:pl-3">
              <button
                type="button"
                onClick={handleSearch}
                className="flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md transition-all duration-200 hover:bg-blue-700 md:h-12 md:w-14"
                aria-label="Search"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {activePanel ? (
            <div
              className="fixed inset-0 z-50 flex items-start justify-center bg-black/35 px-4 py-6 sm:items-center"
              onClick={closePanel}
            >
              <div
                role="dialog"
                aria-modal="true"
                className="w-full max-w-6xl rounded-2xl border border-slate-200 bg-white"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {activePanel === "dates" ? "Calendar" : "Guests"}
                    </p>
                    <h2 className="mt-1 text-base font-semibold text-slate-900">
                      {activePanel === "dates" ? "Choose your stay dates" : "Set guests and rooms"}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={closePanel}
                    className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    aria-label="Close panel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-[80vh] overflow-y-auto p-4 sm:p-6">
                  {activePanel === "dates" ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 lg:grid-cols-2">
                        {[currentMonth, nextMonth].map((month, monthIndex) => (
                          <div key={month.title} className="rounded-2xl border border-slate-200 p-4">
                            <div className="mb-4 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
                                className={`rounded-full border border-slate-200 px-2 py-2 text-slate-600 transition hover:bg-(--light-blue) ${monthIndex === 1 ? "invisible" : ""}`}
                                aria-label="Previous month"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </button>
                              <h3 className="text-sm font-semibold text-slate-900">{month.title}</h3>
                              <button
                                type="button"
                                onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
                                className={`rounded-full border border-slate-200 px-2 py-2 text-slate-600 transition hover:bg-(--light-blue) ${monthIndex === 0 ? "invisible" : ""}`}
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

                                const disabled = isPastDate(date, today);
                                const selectedStart = isRangeStart(date);
                                const selectedEnd = isRangeEnd(date);
                                const inRange = isInRange(date);

                                return (
                                  <button
                                    key={date.toISOString()}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => handleDateClick(date)}
                                    className={`h-10 rounded-lg border text-sm font-medium transition ${
                                      selectedStart || selectedEnd
                                        ? "border-transparent text-white"
                                        : inRange
                                          ? "border-transparent"
                                          : "border-slate-200 bg-white text-slate-700 hover:bg-(--light-blue)"
                                    } ${disabled ? "cursor-not-allowed bg-slate-100 text-slate-300 hover:bg-slate-100" : ""}`}
                                    style={{
                                      backgroundColor: selectedStart || selectedEnd ? BLUE : inRange ? LIGHT_BLUE : undefined,
                                    }}
                                  >
                                    {date.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 sm:px-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-slate-900">
                            {checkIn && checkOut ? `${formatShortDate(checkIn)} – ${formatShortDate(checkOut)}` : "Selected range will appear here"}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span>{nights} night{nights === 1 ? "" : "s"}</span>
                          <span className="text-slate-400">•</span>
                          <span>Check-in after 15:00, check-out before 11:00</span>
                          <span className="text-slate-400">•</span>
                          <span>Prices shown in KRW</span>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {activePanel === "guests" ? (
                    <div className="space-y-4">
                      {[
                        {
                          label: "Rooms",
                          value: roomCount,
                          min: 1,
                          max: 10,
                          onDecrease: () => adjustCount("rooms", -1),
                          onIncrease: () => adjustCount("rooms", 1),
                        },
                        {
                          label: "Adults (18+ yrs)",
                          value: adultCount,
                          min: 1,
                          max: 10,
                          onDecrease: () => adjustCount("adults", -1),
                          onIncrease: () => adjustCount("adults", 1),
                        },
                        {
                          label: "Children (0–17 yrs)",
                          value: childCount,
                          min: 0,
                          max: 6,
                          onDecrease: () => adjustCount("children", -1),
                          onIncrease: () => adjustCount("children", 1),
                        },
                      ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-slate-200 px-4 py-4 sm:px-5">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                              <p className="text-xs text-slate-500">
                                {item.label === "Children (0–17 yrs)" ? "Select child ages below" : "Choose how many"}
                              </p>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={item.onDecrease}
                                disabled={item.value === item.min}
                                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-(--light-blue) disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={`Decrease ${item.label}`}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="min-w-8 text-center text-sm font-semibold text-slate-900">{item.value}</span>
                              <button
                                type="button"
                                onClick={item.onIncrease}
                                disabled={item.value === item.max}
                                className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-(--light-blue) disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={`Increase ${item.label}`}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {childCount > 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:px-5">
                          <p className="text-sm text-slate-600">
                            Please select your child&apos;s age at the time of check-in
                          </p>

                          <div className="mt-4 space-y-3">
                            {childAges.slice(0, childCount).map((age, index) => (
                              <label key={`child-age-${index}`} className="block">
                                <span className="mb-1 block text-sm font-medium text-slate-900">
                                  Child {index + 1} *
                                </span>
                                <select
                                  value={age}
                                  onChange={(event) => {
                                    const nextAge = event.target.value as ChildAge;
                                    setChildAges((current) => {
                                      const next = [...current];
                                      next[index] = nextAge;
                                      return next;
                                    });
                                  }}
                                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-(--blue)"
                                >
                                  {CHILD_AGE_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
                    <button
                      type="button"
                      onClick={closePanel}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-(--light-blue)"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={closePanel}
                      className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                      style={{ backgroundColor: BLUE }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

        </div>
      </div>
    </section>
  );
}