import Link from "next/link"

import { getActiveLocations } from "@/actions/location"

export default async function BookPage() {
  const locations = await getActiveLocations()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Book a Service
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Select a city to see available providers
        </p>
      </div>

      {locations.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Link
              key={location.id}
              href={`/book/${location.id}`}
              className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">
                {location.cityName}
              </h2>
              {location.region && (
                <p className="mt-1 text-sm text-gray-500">{location.region}</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
          No locations available at the moment.
        </div>
      )}
    </div>
  )
}
