import Link from "next/link";
import { routes } from "@/config/routes";
import TourCard, { TourItem } from "./TourCard";

const tours: TourItem[] = [
  {
    id: "tokyo-night-food",
    title: "Tokyo Night Food Tour and Hidden Izakaya Experience",
    city: "Tokyo",
    country: "Japan",
    duration: "4 hours",
    rating: 4.8,
    reviewCount: 324,
    priceFrom: 58,
    image:
      "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Local guide", "Street food", "Small group"],
  },
  {
    id: "paris-museum-day",
    title: "Paris Museums and Seine Cruise Full-Day Tour",
    city: "Paris",
    country: "France",
    duration: "8 hours",
    rating: 4.7,
    reviewCount: 291,
    priceFrom: 76,
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Skip-the-line", "Cruise", "City center"],
  },
  {
    id: "dubai-desert-safari",
    title: "Dubai Desert Safari with Dinner and Live Shows",
    city: "Dubai",
    country: "UAE",
    duration: "6 hours",
    rating: 4.9,
    reviewCount: 468,
    priceFrom: 64,
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Hotel pickup", "BBQ dinner", "Family-friendly"],
  },
  {
    id: "rome-colosseum",
    title: "Rome Colosseum, Forum and Palatine Guided Tour",
    city: "Rome",
    country: "Italy",
    duration: "3.5 hours",
    rating: 4.8,
    reviewCount: 512,
    priceFrom: 52,
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Top guide", "Priority entry", "History walk"],
  },
];

export default function FeaturedTours() {
  return (
    <section className="w-full py-10">
      <div className="mx-auto w-full px-4 py-14 sm:px-6 lg:w-[70vw] lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Recommended Tours
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href={routes.destinations}
            className="inline-flex items-center rounded-xl border border-blue-500 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:border-blue-600"
          >
            View all Tours
          </Link>
        </div>
      </div>
    </section>
  );
}
