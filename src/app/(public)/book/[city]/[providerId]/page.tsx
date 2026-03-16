import Link from "next/link"
import { notFound } from "next/navigation"

import { getLocationById } from "@/actions/location"
import { getProviderById, getServicesByProvider } from "@/actions/provider"
import { getAvailableTimeSlots } from "@/lib/schedule"
import { TimeSlotPicker } from "@/components/booking/time-slot-picker"

interface ProviderBookingPageProps {
  params: { city: string; providerId: string }
  searchParams: { date?: string; serviceId?: string }
}

export default async function ProviderBookingPage({
  params,
  searchParams,
}: ProviderBookingPageProps) {
  const [location, provider] = await Promise.all([
    getLocationById({ id: params.city }),
    getProviderById({ id: params.providerId }),
  ])

  if (!location || !provider) notFound()

  const providerServices = await getServicesByProvider(provider.id)
  const selectedServiceId = searchParams.serviceId || providerServices[0]?.id
  const selectedService = providerServices.find((s) => s.id === selectedServiceId)
  const selectedDate = searchParams.date || new Date().toISOString().split("T")[0]!

  let availableSlots: string[] = []
  if (selectedService) {
    availableSlots = await getAvailableTimeSlots(
      provider.id,
      location.id,
      new Date(selectedDate),
      selectedService.durationMinutes
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/book/${location.id}?date=${selectedDate}`}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back to {location.cityName}
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Provider info */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl font-semibold text-gray-600">
                {provider.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {provider.name}
                </h1>
                <p className="text-sm text-gray-500">{location.cityName}</p>
              </div>
            </div>
            {provider.bio && (
              <p className="mt-4 text-sm text-gray-600">{provider.bio}</p>
            )}

            {/* Service selector */}
            {providerServices.length > 0 && (
              <div className="mt-6 space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Service</h3>
                <div className="space-y-1">
                  {providerServices.map((service) => (
                    <Link
                      key={service.id}
                      href={`/book/${location.id}/${provider.id}?date=${selectedDate}&serviceId=${service.id}`}
                      className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                        service.id === selectedServiceId
                          ? "bg-gray-900 text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{service.name}</span>
                        <span className="text-xs opacity-75">
                          {service.durationMinutes}min
                        </span>
                      </div>
                      {service.basePrice && (
                        <span className="text-xs opacity-75">
                          ¥{service.basePrice}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Time slot selection */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Select a time — {selectedDate}
            </h2>
            {selectedService ? (
              <div className="mt-1 text-sm text-gray-500">
                {selectedService.name} · {selectedService.durationMinutes} min
                {selectedService.basePrice && ` · ¥${selectedService.basePrice}`}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                This provider has no services assigned yet.
              </p>
            )}

            {selectedService && availableSlots.length > 0 ? (
              <TimeSlotPicker
                slots={availableSlots}
                locationId={location.id}
                providerId={provider.id}
                serviceId={selectedService.id}
                date={selectedDate}
                serviceName={selectedService.name}
                providerName={provider.name}
                cityName={location.cityName}
                price={selectedService.basePrice}
                duration={selectedService.durationMinutes}
              />
            ) : selectedService ? (
              <div className="mt-6 rounded-md bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                No available time slots on this date.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
