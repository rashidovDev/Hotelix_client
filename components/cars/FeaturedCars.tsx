import Link from "next/link";
import { routes } from "@/config/routes";
import CarCard, { CarItem } from "./CarCard";

const cars: CarItem[] = [
  {
    id: "bmw-x3-2024",
    name: "BMW X3 xDrive 2024",
    location: "Downtown",
    transmission: "Automatic",
    seats: 5,
    fuel: "Hybrid",
    rating: 4.8,
    reviews: 212,
    pricePerDay: 92,
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
    tags: ["Unlimited km", "Free cancellation", "Airport pickup"],
  },
  {
    id: "tesla-model-3",
    name: "Tesla Model 3 Long Range",
    location: "Airport",
    transmission: "Automatic",
    seats: 5,
    fuel: "Electric",
    rating: 4.9,
    reviews: 307,
    pricePerDay: 104,
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
    tags: ["Fast charge", "Instant booking", "Premium support"],
  },
  {
    id: "toyota-rav4",
    name: "Toyota RAV4 Adventure",
    location: "City Center",
    transmission: "Automatic",
    seats: 5,
    fuel: "Petrol",
    rating: 4.7,
    reviews: 188,
    pricePerDay: 68,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    tags: ["Family friendly", "Low deposit", "Road assistance"],
  },
  {
    id: "mercedes-c-class",
    name: "Mercedes C-Class Sedan",
    location: "Old Town",
    transmission: "Automatic",
    seats: 5,
    fuel: "Diesel",
    rating: 4.8,
    reviews: 254,
    pricePerDay: 110,
    image:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80",
    tags: ["Luxury", "Insurance included", "Verified host"],
  },
];

export default function FeaturedCars() {
  return (
    <section className="w-full">
      <div className="mx-auto w-full px-4 py-14 sm:px-6 lg:w-[70vw] lg:px-0">
        <div className="mb-8 flex flex-col gap-2 sm:mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Recommended Cars
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href={`${routes.search}?category=cars`}
            className="inline-flex items-center rounded-xl border border-blue-500 px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:border-blue-600"
          >
            View all Cars
          </Link>
        </div>
      </div>
    </section>
  );
}
