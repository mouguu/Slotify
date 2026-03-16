import { getAllClients } from "@/actions/client"

export default async function ClientsPage() {
  const clients = await getAllClients()

  const sortedClients = clients.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Clients
        </h1>
        <p className="text-sm text-muted-foreground">
          View all registered clients
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {sortedClients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    User ID
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Telegram ID
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Membership
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-6 py-3 text-gray-600">
                      <span className="max-w-[160px] truncate inline-block">
                        {client.userId}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {client.telegramId ?? "-"}
                    </td>
                    <td className="px-6 py-3">
                      <MembershipBadge status={client.membershipStatus} />
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            No clients yet.
          </div>
        )}
      </div>
    </div>
  )
}

function MembershipBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    unpaid: "bg-gray-100 text-gray-800",
    active: "bg-green-100 text-green-800",
    expired: "bg-red-100 text-red-800",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  )
}
