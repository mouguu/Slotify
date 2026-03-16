import Link from "next/link"

import { getAllProviders } from "@/actions/provider"
import { Button } from "@/components/ui/button"

export default async function ProvidersPage() {
  const providers = await getAllProviders()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Providers
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your service providers
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/providers/new">Add Provider</Link>
        </Button>
      </div>

      {providers.length > 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Telegram ID
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {providers.map((provider) => (
                  <tr
                    key={provider.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-6 py-3">
                      <Link
                        href={`/admin/providers/${provider.id}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {provider.name}
                      </Link>
                    </td>
                    <td className="px-6 py-3">
                      <ProviderStatusBadge status={provider.status} />
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {provider.telegramId ?? "-"}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {new Date(provider.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">
            No providers yet. Add your first provider to get started.
          </p>
          <Button asChild className="mt-4">
            <Link href="/admin/providers/new">Add Provider</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

function ProviderStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    traveling: "bg-blue-100 text-blue-800",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  )
}
