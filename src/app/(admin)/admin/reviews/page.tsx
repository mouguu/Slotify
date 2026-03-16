import { getAllReviews } from "@/actions/review"

export default async function ReviewsPage() {
  const reviews = await getAllReviews()

  const sortedReviews = reviews.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Reviews
        </h1>
        <p className="text-sm text-muted-foreground">
          View all client reviews
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {sortedReviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Rating
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Comment
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Provider ID
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Client ID
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Public
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedReviews.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-6 py-3 text-gray-900">
                      <StarRating rating={review.rating} />
                    </td>
                    <td className="max-w-[300px] px-6 py-3 text-gray-600">
                      <span className="line-clamp-2">
                        {review.comment ?? "-"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      <span className="max-w-[120px] truncate inline-block">
                        {review.providerId}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      <span className="max-w-[120px] truncate inline-block">
                        {review.clientId}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          review.isPublic
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {review.isPublic ? "Public" : "Private"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            No reviews yet.
          </div>
        )}
      </div>
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={i < rating ? "text-yellow-500" : "text-gray-300"}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating}/5</span>
    </div>
  )
}
