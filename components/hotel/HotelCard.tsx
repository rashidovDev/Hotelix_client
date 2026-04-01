import Link from "next/link";
import { HotelEntity } from "@/types";
import { MapPin, Star } from "lucide-react";
import { routes } from "@/config/routes";

export default function HotelCard({ hotel }: { hotel: HotelEntity }) {
  return (
    <Link href={routes.hotel(hotel.id)}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          {hotel.images?.[0] ? (
            <img
              src={hotel.images[0]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50">
              <span className="text-4xl">🏨</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="font-semibold text-gray-800 text-lg truncate">
            {hotel.name}
          </h3>

          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{hotel.city}, {hotel.country}</span>
          </div>

          {hotel.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-700">
                {hotel.rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Amenities */}
          <div className="flex flex-wrap gap-1 mt-1">
            {hotel.amenities?.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}