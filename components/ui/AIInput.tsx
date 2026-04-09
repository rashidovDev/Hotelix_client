"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
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
  const [workTrip, setWorkTrip] = useState(false);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));

  const today = useMemo(() => startOfDay(new Date()), []);
  const currentMonth = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);
  const nextMonth = useMemo(() => buildMonthGrid(addMonths(visibleMonth, 1)), [visibleMonth]);
  const nights = nightsBetween(checkIn, checkOut);
  const dateSummary = checkIn && checkOut ? `${formatShortDate(checkIn)} – ${formatShortDate(checkOut)}` : "Select dates";

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

  const toggleStar = (star: number) => {
    setSelectedStars((current) =>
      current.includes(star) ? current.filter((item) => item !== star) : [...current, star].sort((left, right) => left - right)
    );
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

    if (workTrip) params.set("workTrip", "true");
    if (selectedStars.length > 0) params.set("stars", selectedStars.join(","));

    router.push(`${routes.search}?${params.toString()}`);
    closePanel();
  };

  const roomsSummary = `${roomCount} room${roomCount > 1 ? "s" : ""}`;
  const adultsSummary = `${adultCount} adult${adultCount > 1 ? "s" : ""}`;
  const childrenSummary = `${childCount} child${childCount === 1 ? "" : "ren"}`;

  return (
    <section
      className="w-full px-4 py-8 mt-25 sm:px-6 lg:px-8"
      style={{
        ["--blue" as never]: BLUE,
        ["--light-blue" as never]: LIGHT_BLUE,
      } as React.CSSProperties}
    >
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="grid gap-2 p-2.5 lg:grid-cols-[1.2fr_1.55fr_1fr_auto] lg:gap-0">
            <div className="relative flex items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5 transition hover:bg-(--light-blue)" style={{ backgroundColor: LIGHT_BLUE }}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600">
                <MapPin className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">Destination</p>
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Where to?"
                  className="mt-1 w-full bg-transparent text-[13px] font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
              {location.trim() ? (
                <button
                  type="button"
                  onClick={() => setLocation("")}
                  className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-50"
                  aria-label="Clear destination"
                >
                  X
                </button>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => openPanel("dates")}
              className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5 text-left transition hover:bg-(--light-blue)"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600">
                <CalendarDays className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">Dates</p>
                <p className="mt-1 truncate text-[13px] font-medium text-slate-900">{dateSummary}</p>
              </div>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                {nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "Select"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => openPanel("guests")}
              className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5 text-left transition hover:bg-(--light-blue)"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600">
                <Users className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">Guests</p>
                <p className="mt-1 truncate text-[13px] font-medium text-slate-900">
                  {roomsSummary}, {adultsSummary}, {childrenSummary}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
              style={{ backgroundColor: BLUE }}
            >
              Search
              <Search className="h-4 w-4" />
            </button>
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

          <div className="border-t border-slate-200 px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={workTrip}
                  onChange={(event) => setWorkTrip(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-(--blue) focus:ring-(--blue)"
                />
                <span className="inline-flex items-center gap-2">
                  I&apos;m traveling for work
                  <Info className="h-4 w-4 text-slate-400" />
                </span>
              </label>

              <div className="flex flex-wrap items-center gap-2">
                {[2, 3, 4, 5].map((rating) => {
                  const active = selectedStars.includes(rating);

                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => toggleStar(rating)}
                      className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                        active
                          ? "border-(--blue) bg-(--light-blue) text-(--blue)"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-(--light-blue)"
                      }`}
                    >
                      {rating === 2 ? "≤2 ★" : `${rating} ★`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}