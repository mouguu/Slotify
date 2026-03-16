import Link from "next/link"
import { notFound } from "next/navigation"

import { getLocationById } from "@/actions/location"
import { getAvailableProvidersByLocationAndDate } from "@/actions/schedule"
import { getServicesByProvider } from "@/actions/provider"
import { DatePickerButton } from "@/components/booking/date-picker-button"

interface CityPageProps {
  params: { city: string }
  searchParams: { date?: string }
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
  const location = await getLocationById({ id: params.city })
  if (!location) notFound()

  const selectedDate = searchParams.date || new Date().toISOString().split("T")[0]!
  const providers = await getAvailableProvidersByLocationAndDate(
    location.id,
    selectedDate
  )

  // Get services for each provider
  const providersWithServices = await Promise.all(
    providers.map(async (provider) => {
      const services = await getServicesByProvider(provider.id)
      return { ...provider, services }
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/book"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; All cities
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
          {location.cityName}
        </h1>
        {location.region && (
          <p className="text-sm text-gray-500">{location.region}</p>
        )}
      </div>

      {/* Date picker */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Date:</span>
        <DatePickerButton currentDate={selectedDate} />
      </div>

      {/* Provider list */}
      {providersWithServices.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {providersWithServices.map((provider) => (
            <Link
              key={provider.id}
              href={`/book/${location.id}/${provider.id}?date=${selectedDate}`}
              className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-600">
                  {provider.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                    {provider.name}
                  </h3>
                  {provider.bio && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {provider.bio}
                    </p>
                  )}
                  {provider.services.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {provider.services.slice(0, 3).map((service) => (
                        <span
                          key={service.id}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                        >
                          {service.name}
                        </span>
                      ))}
                      {provider.services.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{provider.services.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
          No providers available in {location.cityName} on this date.
        </div>
      )}
    </div>
  )
}
