import Link from "next/link";
import { routes } from "@/config/routes";
import GuideCard, { GuideItem } from "./GuideCard";

const guides: GuideItem[] = [
  {
    id: "yuki-tokyo",
    name: "Yuki Tanaka",
    city: "Tokyo",
    country: "Japan",
    priceFrom: 45,
    rating: 4.9,
    reviewCount: 186,
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80",
    specialty: "Food & Culture",
  },
  {
    id: "marco-rome",
    name: "Marco Bianchi",
    city: "Rome",
    country: "Italy",
    priceFrom: 38,
    rating: 4.8,
    reviewCount: 241,
    image:
      "https://images.unsplash.com/photo-1522556189639-b1504e58f52a?auto=format&fit=crop&w=1200&q=80",
    specialty: "History Walks",
  },
  {
    id: "amelie-paris",
    name: "Amelie Laurent",
    city: "Paris",
    country: "France",
    priceFrom: 52,
    rating: 4.9,
    reviewCount: 203,
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=80",
    specialty: "Art & Museums",
  },
  {
    id: "omar-dubai",
    name: "Omar Al Mansoori",
    city: "Dubai",
    country: "UAE",
    priceFrom: 49,
    rating: 4.7,
    reviewCount: 159,
    image:
      "https://images.unsplash.com/photo-1474176857210-7287d38d27c6?auto=format&fit=crop&w=1200&q=80",
    specialty: "Desert Adventures",
  },
];

export default function FeaturedGuides() {
  return (
    <section className="w-full">
      <div className="mx-auto w-full px-4 py-14 sm:px-6 lg:w-[70vw] lg:px-0">
        <div className="mb-8 flex flex-col gap-2 sm:mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Recommended Guides
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href={routes.guides}
            className="inline-flex items-center rounded-xl border border-blue-500 bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-blue-600 hover:bg-blue-600"
          >
            View all Guides
          </Link>
        </div>
      </div>
    </section>
  );
}
