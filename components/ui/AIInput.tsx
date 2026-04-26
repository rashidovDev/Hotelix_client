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

    router.push(`${routes.hotels}?${params.toString()}`);
    closePanel();
  };

  const roomsSummary = `${roomCount} room${roomCount > 1 ? "s" : ""}`;
  const adultsSummary = `${adultCount} adult${adultCount > 1 ? "s" : ""}`;
  const childrenSummary = `${childCount} child${childCount === 1 ? "" : "ren"}`;

  return (
    <section
      className="w-[60%] mx-auto px-4 py-4 sm:py-5 lg:py-8 mt-8 sm:mt-10 lg:mt-28 lg:px-8"
      style={{
        ["--blue" as never]: BLUE,
        ["--light-blue" as never]: LIGHT_BLUE,
      } as React.CSSProperties}
    >
      <div className="mx-auto max-w-7xl">
        <h1 className="text-center text-lg sm:text-xl lg:text-4xl text-white mb-3 sm:mb-3 font-bold">Book your stay with Hotelix</h1>
        <div className="w-full rounded-2xl sm:rounded-full bg-white px-2 sm:px-2.5 md:px-3 lg:px-4 py-1.5 sm:py-2 md:py-2.5 lg:py-3 shadow-md transition-all duration-200">
          <div className="flex flex-col gap-1 sm:gap-1 md:h-12 md:flex-row md:items-center md:gap-0">
            <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-stretch gap-1 sm:gap-0">
              <div className="group relative flex flex-1 cursor-pointer flex-col justify-center rounded-lg sm:rounded-none px-3 sm:px-3 py-1.5 sm:py-2 transition-all duration-200 hover:bg-gray-50 focus-within:scale-[1.02] focus-within:bg-gray-100 md:border-r md:border-gray-200">
                <label className="text-[11px] font-medium text-gray-500">Location</label>
                <div className="mt-0.5 flex items-center gap-2 min-h-6 sm:min-h-auto">
                  <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 shrink-0" />
                  <input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Where to?"
                    className="w-full placeholder:text-[11px] bg-transparent text-[11px] sm:text-xs font-semibold text-gray-800 outline-none placeholder:text-gray-400"
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
                className={`flex flex-1 cursor-pointer flex-col justify-center rounded-lg sm:rounded-none px-3 sm:px-3 py-1.5 sm:py-2 text-left transition-all duration-200 hover:bg-gray-50 md:border-r md:border-gray-200 ${activePanel === "dates" ? "bg-gray-100 scale-[1.02]" : ""}`}
              >
                <span className="text-[11px] font-medium text-gray-500">Check-in</span>
                <span className="mt-0.5 truncate text-[11px] sm:text-xs font-semibold text-gray-800">{checkInSummary}</span>
              </button>

              <button
                type="button"
                onClick={() => openPanel("dates")}
                className={`flex flex-1 cursor-pointer flex-col justify-center rounded-lg sm:rounded-none px-3 sm:px-3 py-1.5 sm:py-2 text-left transition-all duration-200 hover:bg-gray-50 md:border-r md:border-gray-200 ${activePanel === "dates" ? "bg-gray-100 scale-[1.02]" : ""}`}
              >
                <span className="text-[11px] font-medium text-gray-500">Check-out</span>
                <span className="mt-0.5 truncate text-[11px] sm:text-xs font-semibold text-gray-800">{checkOutSummary}</span>
              </button>

              <button
                type="button"
                onClick={() => openPanel("guests")}
                className={`flex flex-1 cursor-pointer flex-col justify-center rounded-lg sm:rounded-full px-3 sm:px-3 py-1.5 sm:py-2 text-left transition-all duration-200 hover:bg-gray-50 ${activePanel === "guests" ? "bg-gray-100 scale-[1.02]" : ""}`}
              >
                <span className="text-[11px] font-medium text-gray-500">Guests</span>
                <span className="mt-0.5 truncate text-[11px] sm:text-xs font-semibold text-gray-800">
                  {roomsSummary}, {adultsSummary}, {childrenSummary}
                </span>
              </button>
            </div>

            <div className="flex justify-end md:ml-1 md:border-l md:border-gray-200 md:pl-1.5 lg:md:pl-2">
              <button
                type="button"
                onClick={handleSearch}
                className="flex h-8 sm:h-9 md:h-10 md:w-10 lg:md:w-11 w-full sm:w-auto items-center justify-center rounded-lg sm:rounded-full bg-blue-600 text-white shadow-md transition-all duration-200 hover:bg-blue-700 gap-2 sm:gap-0"
                aria-label="Search"
              >
                <span className="sm:hidden text-[11px] font-semibold">Search</span>
                <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5" />
              </button>
            </div>
          </div>

          {activePanel ? (
            <div
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/35 px-3 py-0 sm:py-6 sm:px-4"
              onClick={closePanel}
            >
              <div
                role="dialog"
                aria-modal="true"
                className="w-full max-h-[90vh] sm:max-h-[80vh] max-w-2xl sm:max-w-4xl lg:max-w-6xl rounded-t-2xl sm:rounded-2xl border border-slate-200 bg-white overflow-y-auto"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-slate-200 px-3 sm:px-3 md:px-4 py-2 sm:py-2.5 sticky top-0 bg-white">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {activePanel === "dates" ? "Calendar" : "Guests"}
                    </p>
                    <h2 className="mt-0.5 text-[11px] sm:text-xs font-semibold text-slate-900">
                      {activePanel === "dates" ? "Choose your stay dates" : "Set guests and rooms"}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={closePanel}
                    className="rounded-full border border-slate-200 px-1.5 sm:px-2 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium text-slate-600 transition hover:bg-slate-50 shrink-0"
                    aria-label="Close panel"
                  >
                    <X className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                  </button>
                </div>

                <div className="overflow-y-auto p-2 sm:p-3 md:p-4 max-h-[calc(90vh-3rem)] sm:max-h-[calc(80vh-3rem)]">
                  {activePanel === "dates" ? (
                    <div className="space-y-2 sm:space-y-3">
                      <div className="grid gap-2 sm:gap-3 grid-cols-1 lg:grid-cols-2">
                        {[currentMonth, nextMonth].map((month, monthIndex) => (
                          <div key={month.title} className="rounded-lg sm:rounded-xl border border-slate-200 p-2 sm:p-3">
                            <div className="mb-2 sm:mb-3 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
                                className={`rounded-full border border-slate-200 p-0.5 sm:p-1 text-slate-600 transition hover:bg-(--light-blue) text-xs sm:text-sm ${monthIndex === 1 ? "invisible" : ""}`}
                                aria-label="Previous month"
                              >
                                <ChevronLeft className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                              </button>
                              <h3 className="text-[11px] sm:text-xs font-semibold text-slate-900">{month.title}</h3>
                              <button
                                type="button"
                                onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
                                className={`rounded-full border border-slate-200 p-0.5 sm:p-1 text-slate-600 transition hover:bg-(--light-blue) text-xs sm:text-sm ${monthIndex === 0 ? "invisible" : ""}`}
                                aria-label="Next month"
                              >
                                <ChevronRight className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-7 gap-0.5 text-center text-[11px] font-medium text-slate-500">
                              {WEEK_DAYS.map((day) => (
                                <span key={day} className="py-0.5 text-[10px]">
                                  {day}
                                </span>
                              ))}
                            </div>

                            <div className="mt-1 grid grid-cols-7 gap-0.5">
                              {month.weeks.flat().map((date, index) => {
                                if (!date) {
                                  return <span key={`empty-${index}`} className="h-7 sm:h-8 rounded-lg" />;
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
                                    className={`h-7 sm:h-8 rounded-lg border text-[11px] font-medium transition ${
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

                      <div className="rounded-lg sm:rounded-xl border border-slate-200 bg-white px-3 sm:px-3 md:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs text-slate-600">
                        <div className="flex flex-col sm:flex-wrap items-start sm:items-center gap-1 sm:gap-1.5">
                          <span className="font-semibold text-slate-900 text-[11px] sm:text-xs">
                            {checkIn && checkOut ? `${formatShortDate(checkIn)} – ${formatShortDate(checkOut)}` : "Selected range will appear here"}
                          </span>
                          <span className="text-slate-400 hidden sm:inline">•</span>
                          <span className="text-[11px] sm:text-xs">{nights} night{nights === 1 ? "" : "s"}</span>
                          <span className="text-slate-400 hidden sm:inline">•</span>
                          <span className="text-[11px] line-clamp-1">Check-in 15:00, Check-out 11:00</span>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {activePanel === "guests" ? (
                    <div className="space-y-3">
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
                        <div key={item.label} className="rounded-lg sm:rounded-xl border border-slate-200 px-3 sm:px-3 md:px-4 py-2 sm:py-2.5">
                          <div className="flex items-center justify-between gap-2 sm:gap-3">
                            <div>
                              <p className="text-[11px] sm:text-xs font-semibold text-slate-900">{item.label}</p>
                              <p className="text-[11px] text-slate-500">
                                {item.label === "Children (0–17 yrs)" ? "Select ages below" : "How many"}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={item.onDecrease}
                                disabled={item.value === item.min}
                                className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-(--light-blue) disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={`Decrease ${item.label}`}
                              >
                                <Minus className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
                              </button>
                              <span className="min-w-5 sm:min-w-6 text-center text-[11px] sm:text-xs font-semibold text-slate-900">{item.value}</span>
                              <button
                                type="button"
                                onClick={item.onIncrease}
                                disabled={item.value === item.max}
                                className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-(--light-blue) disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={`Increase ${item.label}`}
                              >
                                <Plus className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {childCount > 0 ? (
                        <div className="rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50 px-3 sm:px-3 md:px-4 py-2 sm:py-2.5">
                          <p className="text-[11px] sm:text-xs text-slate-600">
                            Please select child ages at check-in
                          </p>

                          <div className="mt-2 sm:mt-2.5 space-y-1.5 sm:space-y-2">
                            {childAges.slice(0, childCount).map((age, index) => (
                              <label key={`child-age-${index}`} className="block">
                                <span className="mb-0.5 block text-[11px] sm:text-xs font-medium text-slate-900">
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
                                  className="w-full rounded-lg sm:rounded-lg border border-slate-200 bg-white px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs text-slate-900 outline-none transition focus:border-(--blue)"
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

                  <div className="mt-3 sm:mt-4 flex flex-col-reverse sm:flex-row justify-end gap-1.5 sm:gap-2 border-t border-slate-200 pt-2 sm:pt-3 sticky bottom-0 bg-white">
                    <button
                      type="button"
                      onClick={closePanel}
                      className="rounded-lg sm:rounded-lg border border-slate-200 px-3 sm:px-3 py-1.5 sm:py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 transition hover:bg-(--light-blue)"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={closePanel}
                      className="inline-flex items-center justify-center gap-2 rounded-lg sm:rounded-lg px-3 sm:px-3 py-1.5 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-white transition hover:opacity-95 w-full sm:w-auto"
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