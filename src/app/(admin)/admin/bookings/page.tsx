import { getAllBookings } from "@/actions/booking"

export default async function BookingsPage() {
  const bookings = await getAllBookings()

  const sortedBookings = bookings.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Bookings
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage all bookings
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {sortedBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Time
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Provider ID
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Client ID
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Location ID
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-6 py-3 text-gray-900">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-gray-900">
                      {booking.bookingTime}
                    </td>
                    <td className="px-6 py-3">
                      <BookingStatusBadge status={booking.status} />
                    </td>
                    <td className="truncate px-6 py-3 text-gray-600">
                      <span className="max-w-[120px] truncate inline-block">
                        {booking.providerId}
                      </span>
                    </td>
                    <td className="truncate px-6 py-3 text-gray-600">
                      <span className="max-w-[120px] truncate inline-block">
                        {booking.clientId}
                      </span>
                    </td>
                    <td className="truncate px-6 py-3 text-gray-600">
                      <span className="max-w-[120px] truncate inline-block">
                        {booking.locationId}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-900">
                      {booking.totalPrice ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            No bookings yet.
          </div>
        )}
      </div>
    </div>
  )
}

function BookingStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
    rejected: "bg-red-100 text-red-800",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  )
}
