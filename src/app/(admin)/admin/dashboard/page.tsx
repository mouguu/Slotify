import { getAllProviders } from "@/actions/provider"
import { getAllBookings } from "@/actions/booking"
import { getAllClients } from "@/actions/client"
import { getActiveLocations } from "@/actions/location"

export default async function DashboardPage() {
  const [providers, bookings, clients, locations] = await Promise.all([
    getAllProviders(),
    getAllBookings(),
    getAllClients(),
    getActiveLocations(),
  ])

  const recentBookings = bookings
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)

  const stats = [
    { title: "Total Providers", value: providers.length },
    { title: "Total Bookings", value: bookings.length },
    { title: "Total Clients", value: clients.length },
    { title: "Active Locations", value: locations.length },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of your booking platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Bookings
          </h2>
        </div>
        {recentBookings.length > 0 ? (
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
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
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
                      <StatusBadge status={booking.status} />
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
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            No bookings yet.
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
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
