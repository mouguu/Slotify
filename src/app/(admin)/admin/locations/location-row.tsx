"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { deleteLocation, updateLocation } from "@/actions/location"
import { Button } from "@/components/ui/button"
import type { Location } from "@/db/schema"

export function LocationRow({ location }: { location: Location }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleToggleActive() {
    startTransition(async () => {
      await updateLocation({
        id: location.id,
        isActive: !location.isActive,
      })
      router.refresh()
    })
  }

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this location?")) return

    startTransition(async () => {
      await deleteLocation({ id: location.id })
      router.refresh()
    })
  }

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-6 py-3 font-medium text-gray-900">
        {location.cityName}
      </td>
      <td className="px-6 py-3 text-gray-600">{location.region ?? "-"}</td>
      <td className="px-6 py-3">
        <button
          onClick={handleToggleActive}
          disabled={isPending}
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            location.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {location.isActive ? "Active" : "Inactive"}
        </button>
      </td>
      <td className="px-6 py-3 text-gray-600">
        {new Date(location.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
          className="text-red-600 hover:text-red-700"
        >
          Delete
        </Button>
      </td>
    </tr>
  )
}
