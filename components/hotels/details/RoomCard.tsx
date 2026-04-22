export interface RoomItem {
  id: string;
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
  onBookNow: () => void;
}

export default function RoomCard({ room, onBookNow }: RoomCardProps) {
  return (
    <article className="relative group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]">
      <div className="relative overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/20 via-transparent to-transparent opacity-70" />
      </div>

      <div className="relative flex-1 space-y-4 p-5 pb-24">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-tight text-slate-900">{room.name}</h3>
          <div className="flex items-end justify-between gap-3">
            <p className="text-2xl font-bold tracking-tight text-slate-900">
              ${room.price}
              <span className="ml-1 text-sm font-medium text-slate-500">/ night</span>
            </p>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
              Free cancellation
            </span>
          </div>
        </div>

        <ul className="grid gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            <span className="font-medium text-slate-700">{room.size}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            <span className="font-medium text-slate-700">{room.capacity}</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            <span className="font-medium text-slate-700">{room.bedType}</span>
          </li>
        </ul>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Policy</p>
          <p className="mt-1 text-sm text-slate-600">{room.policy}</p>
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <button
            type="button"
            onClick={onBookNow}
            className="inline-flex w-full items-center justify-center rounded-full bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-900/20"
          >
            Book now for ${room.price}
          </button>
        </div>
      </div>
    </article>
  );
}
