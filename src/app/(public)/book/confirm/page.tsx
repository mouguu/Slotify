import Link from "next/link"

interface ConfirmPageProps {
  searchParams: {
    provider?: string
    service?: string
    city?: string
    date?: string
    time?: string
    duration?: string
    price?: string
  }
}

export default function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const { provider, service, city, date, time, duration, price } = searchParams

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="size-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Booking Confirmed</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your appointment has been submitted
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <dl className="space-y-3 text-sm">
          {provider && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Provider</dt>
              <dd className="font-medium text-gray-900">{provider}</dd>
            </div>
          )}
          {service && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Service</dt>
              <dd className="font-medium text-gray-900">{service}</dd>
            </div>
          )}
          {city && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Location</dt>
              <dd className="font-medium text-gray-900">{city}</dd>
            </div>
          )}
          {date && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Date</dt>
              <dd className="font-medium text-gray-900">{date}</dd>
            </div>
          )}
          {time && duration && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Time</dt>
              <dd className="font-medium text-gray-900">
                {time} ({duration} min)
              </dd>
            </div>
          )}
          {price && (
            <div className="flex justify-between border-t border-gray-100 pt-3">
              <dt className="font-medium text-gray-700">Total</dt>
              <dd className="font-semibold text-gray-900">¥{price}</dd>
            </div>
          )}
        </dl>
      </div>

      <p className="text-center text-xs text-gray-400">
        Status: Pending confirmation from the provider
      </p>

      <div className="flex justify-center">
        <Link
          href="/book"
          className="rounded-md bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Book another
        </Link>
      </div>
    </div>
  )
}
