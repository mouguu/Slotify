"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { deleteService } from "@/actions/service"
import { Button } from "@/components/ui/button"
import type { Service } from "@/db/schema"

export function ServiceRow({ service }: { service: Service }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this service?")) return

    startTransition(async () => {
      await deleteService({ id: service.id })
      router.refresh()
    })
  }

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-6 py-3 font-medium text-gray-900">{service.name}</td>
      <td className="px-6 py-3 text-gray-600">
        {service.durationMinutes} min
      </td>
      <td className="px-6 py-3 text-gray-600">{service.basePrice}</td>
      <td className="px-6 py-3 text-gray-600">{service.category ?? "-"}</td>
      <td className="px-6 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            service.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {service.isActive ? "Active" : "Inactive"}
        </span>
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
