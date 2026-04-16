interface ReviewItem {
  title: string;
  author: string;
  description: string;
  pros: string[];
  score: number;
  date: string;
}

interface ReviewsSectionProps {
  reviews: ReviewItem[];
}

const ratingBreakdown = [
  { label: "Cleanliness", value: 96 },
  { label: "Amenities", value: 92 },
  { label: "Location", value: 97 },
  { label: "Comfort", value: 93 },
  { label: "WiFi", value: 90 },
];

function scoreClass(score: number) {
  if (score >= 9) return "bg-green-100 text-green-700";
  if (score >= 7) return "bg-yellow-100 text-yellow-700";
  return "bg-slate-100 text-slate-700";
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Reviews</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-3xl font-bold text-slate-900">9.6 / 10</p>

          <div className="mt-5 space-y-3">
            {ratingBreakdown.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>{item.label}</span>
                  <span>{item.value / 10}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          {reviews.map((review) => (
            <article key={review.author + review.date} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{review.title}</h3>
                  <p className="text-xs text-gray-500">by {review.author}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${scoreClass(review.score)}`}>
                  {review.score.toFixed(1)}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-600">{review.description}</p>

              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                {review.pros.map((pro) => (
                  <li key={pro}>+ {pro}</li>
                ))}
              </ul>

              <p className="mt-3 text-xs text-gray-400">{review.date}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
