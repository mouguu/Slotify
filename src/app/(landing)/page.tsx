import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <span className="text-lg font-semibold text-gray-900">Slotify</span>
          <div className="flex items-center gap-4">
            <Link
              href="/book"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Book Now
            </Link>
            <Link
              href="/login"
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 items-center justify-center bg-gray-50 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Booking, simplified
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Multi-provider, multi-city service booking platform.
            Find providers, pick a time, and book — all in one place.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/book"
              className="rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-800"
            >
              Browse Services
            </Link>
            <Link
              href="/register"
              className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-gray-400">
          Slotify &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}
