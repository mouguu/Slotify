import Link from "next/link"

export default function PublicLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            Slotify
          </Link>
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sign in
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}
