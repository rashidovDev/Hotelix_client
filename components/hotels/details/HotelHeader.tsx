interface HotelHeaderProps {
  name: string;
  subtitle: string;
  score: number;
  reviewsCount: string;
}

export default function HotelHeader({
  name,
  subtitle,
  score,
  reviewsCount,
}: HotelHeaderProps) {
  return (
    <header className="flex flex-col mt-5 gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">{name}</h1>
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
          Excellent {score}
        </span>
        <p className="text-xs text-gray-400">{reviewsCount}</p>
      </div>
    </header>
  );
}
