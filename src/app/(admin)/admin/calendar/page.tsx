export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Calendar
        </h1>
        <p className="text-sm text-muted-foreground">
          Provider schedule overview
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <p className="mt-4 text-sm font-medium text-gray-900">
            Provider schedule calendar coming soon
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            This section will display a full calendar view of provider
            schedules and bookings.
          </p>
        </div>
      </div>
    </div>
  )
}
