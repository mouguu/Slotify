"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { addBooking } from "@/actions/booking"

interface TimeSlotPickerProps {
  slots: string[]
  locationId: string
  providerId: string
  serviceId: string
  date: string
  serviceName: string
  providerName: string
  cityName: string
  price: string | null
  duration: number
}

export function TimeSlotPicker({
  slots,
  locationId,
  providerId,
  serviceId,
  date,
  serviceName,
  providerName,
  cityName,
  price,
  duration,
}: TimeSlotPickerProps) {
  const router = useRouter()
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleConfirm() {
    if (!selectedSlot) return
    setError(null)

    startTransition(async () => {
      const result = await addBooking({
        providerId,
        serviceId,
        locationId,
        bookingDate: date,
        bookingTime: selectedSlot,
        totalPrice: price ?? undefined,
      })

      if (result === "success") {
        const params = new URLSearchParams({
          provider: providerName,
          service: serviceName,
          city: cityName,
          date,
          time: selectedSlot,
          duration: String(duration),
          price: price || "",
        })
        router.push(`/book/confirm?${params.toString()}`)
      } else if (result === "conflict") {
        setError("This time slot was just booked. Please select another.")
        setSelectedSlot(null)
      } else {
        setError("Something went wrong. Please try again.")
      }
    })
  }

  // Group slots by morning/afternoon/evening
  const morning = slots.filter((s) => {
    const h = parseInt(s.split(":")[0]!, 10)
    return h < 12
  })
  const afternoon = slots.filter((s) => {
    const h = parseInt(s.split(":")[0]!, 10)
    return h >= 12 && h < 18
  })
  const evening = slots.filter((s) => {
    const h = parseInt(s.split(":")[0]!, 10)
    return h >= 18
  })

  function SlotGroup({ label, items }: { label: string; items: string[] }) {
    if (items.length === 0) return null
    return (
      <div>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          {label}
        </h3>
        <div className="flex flex-wrap gap-2">
          {items.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                selectedSlot === slot
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="space-y-4">
        <SlotGroup label="Morning" items={morning} />
        <SlotGroup label="Afternoon" items={afternoon} />
        <SlotGroup label="Evening" items={evening} />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {selectedSlot && (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm">
            <span className="font-medium text-gray-900">{selectedSlot}</span>
            <span className="text-gray-500">
              {" "}· {serviceName} · {duration}min
              {price && ` · ¥${price}`}
            </span>
          </div>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="rounded-md bg-gray-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            {isPending ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      )}
    </div>
  )
}
