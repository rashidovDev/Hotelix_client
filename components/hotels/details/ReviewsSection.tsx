import { FormEvent } from "react";

export interface ReviewItem {
  id: string;
  author: string;
  avatar?: string;
  description: string;
  score: number;
  date: string;
}

interface ReviewsSectionProps {
  reviews: ReviewItem[];
  averageScore: number;
  isLoading?: boolean;
  totalReviews: number;
  isAuthenticated: boolean;
  reviewComment: string;
  reviewRating: number;
  submitLoading: boolean;
  submitError?: string;
  onReviewCommentChange: (value: string) => void;
  onReviewRatingChange: (value: number) => void;
  onReviewSubmit: () => void;
}

function scoreClass(score: number) {
  if (score >= 9) return "bg-green-100 text-green-700";
  if (score >= 7) return "bg-yellow-100 text-yellow-700";
  return "bg-slate-100 text-slate-700";
}

export default function ReviewsSection({
  reviews,
  averageScore,
  isLoading = false,
  totalReviews,
  isAuthenticated,
  reviewComment,
  reviewRating,
  submitLoading,
  submitError,
  onReviewCommentChange,
  onReviewRatingChange,
  onReviewSubmit,
}: ReviewsSectionProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onReviewSubmit();
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">Reviews</h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-3xl font-bold text-slate-900">{averageScore.toFixed(1)} / 10</p>
          <p className="mt-2 text-sm text-slate-600">
            Based on {totalReviews} review{totalReviews === 1 ? "" : "s"}
          </p>

          <div className="mt-5">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Overall</span>
              <span>{averageScore.toFixed(1)}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${Math.max(0, Math.min(100, averageScore * 10))}%` }}
              />
            </div>
          </div>

          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <label className="block text-sm font-medium text-slate-700">Your rating</label>
              <select
                value={reviewRating}
                onChange={(event) => onReviewRatingChange(Number(event.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
              >
                <option value={5}>5 - Excellent</option>
                <option value={4}>4 - Very good</option>
                <option value={3}>3 - Good</option>
                <option value={2}>2 - Fair</option>
                <option value={1}>1 - Poor</option>
              </select>

              <label className="block text-sm font-medium text-slate-700">Your comment</label>
              <textarea
                value={reviewComment}
                onChange={(event) => onReviewCommentChange(event.target.value)}
                rows={4}
                placeholder="Share your thoughts about this hotel"
                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
              />

              {submitError ? <p className="text-xs text-red-600">{submitError}</p> : null}

              <button
                type="submit"
                disabled={submitLoading}
                className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitLoading ? "Submitting..." : "Submit review"}
              </button>
            </form>
          ) : (
            <p className="mt-6 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Sign in to leave a review.
            </p>
          )}
        </aside>

        <div className="space-y-4">
          {isLoading ? <p className="text-sm text-slate-600">Loading reviews...</p> : null}

          {!isLoading && reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
              No reviews yet. Be the first to share your experience.
            </div>
          ) : null}

          {reviews.map((review) => (
            <article key={review.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {review.avatar ? (
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                      {review.author.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-slate-900">{review.author}</h3>
                    <p className="text-xs text-gray-500">Guest review</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${scoreClass(review.score)}`}>
                  {review.score.toFixed(1)}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-600">{review.description}</p>
              <p className="mt-3 text-xs text-gray-400">{review.date}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
