"use client";

import { Edit2, Trash2, Users, DollarSign } from "lucide-react";

interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  description?: string;
  images?: string[];
  hotelId: string;
}

interface RoomsListProps {
  rooms: Room[];
  isOwner?: boolean;
  onDelete?: (roomId: string) => void;
  onEdit?: (room: Room) => void;
  isLoading?: boolean;
}

const ROOM_TYPE_LABELS: Record<string, string> = {
  SINGLE: "Single",
  DOUBLE: "Double",
  DELUXE: "Deluxe",
  SUITE: "Suite",
};

export default function RoomsList({
  rooms,
  isOwner = false,
  onDelete,
  onEdit,
  isLoading = false,
}: RoomsListProps) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <article
          key={room.id}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md"
        >
          {/* Image */}
          <div className="h-48 w-full bg-slate-100">
            {room.images && room.images.length > 0 ? (
              <img
                src={room.images[0]}
                alt={room.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl">
                🛏️
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-3 p-4">
            {/* Type Badge */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-slate-900">{room.name}</h3>
              <span className="shrink-0 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700">
                {ROOM_TYPE_LABELS[room.type] || room.type}
              </span>
            </div>

            {/* Description */}
            {room.description && (
              <p className="line-clamp-2 text-sm text-slate-600">
                {room.description}
              </p>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 border-y border-slate-200 py-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="h-4 w-4 text-slate-400" />
                <span>{room.capacity} guest{room.capacity !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <DollarSign className="h-4 w-4 text-slate-400" />
                <span>${Number(room.price).toFixed(2)}/night</span>
              </div>
            </div>

            {/* Images Count */}
            {room.images && room.images.length > 0 && (
              <p className="text-xs text-slate-500">
                {room.images.length} image{room.images.length !== 1 ? "s" : ""}
              </p>
            )}

            {/* Actions */}
            {isOwner && (onEdit || onDelete) && (
              <div className="flex gap-2 pt-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(room)}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(room.id)}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
