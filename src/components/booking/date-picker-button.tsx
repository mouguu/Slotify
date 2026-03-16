"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"

export function DatePickerButton({ currentDate }: { currentDate: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("date", e.target.value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <input
      type="date"
      value={currentDate}
      onChange={handleChange}
      min={new Date().toISOString().split("T")[0]}
      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
    />
  )
}
