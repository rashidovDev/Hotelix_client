export interface RoomItem {
  name: string;
  image: string;
  size: string;
  capacity: string;
  bedType: string;
  policy: string;
  price: number;
}

interface RoomCardProps {
  room: RoomItem;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <img src={room.image} alt={room.name} className="h-40 w-full object-cover" />

      <div className="p-4">
        <h3 className="font-semibold text-slate-900">{room.name}</h3>

        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          <li>{room.size}</li>
          <li>{room.capacity}</li>
          <li>{room.bedType}</li>
        </ul>

        <p className="mt-3 text-xs text-slate-400">{room.policy}</p>

        <button
          type="button"
          className="mt-4 w-full rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Book now for ${room.price}
        </button>
      </div>
    </article>
  );
}
