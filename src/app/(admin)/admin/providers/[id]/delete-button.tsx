"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { deleteProvider } from "@/actions/provider"
import { Button } from "@/components/ui/button"

export function DeleteProviderButton({
  providerId,
}: {
  providerId: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this provider?")) return

    startTransition(async () => {
      const result = await deleteProvider({ id: providerId })
      if (result === "success") {
        router.push("/admin/providers")
      }
    })
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete Provider"}
    </Button>
  )
}
