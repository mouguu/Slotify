import Link from "next/link"
import { notFound } from "next/navigation"

import { getProviderById } from "@/actions/provider"
import { ProviderForm } from "@/components/forms/provider/provider-form"
import { DeleteProviderButton } from "./delete-button"

interface ProviderDetailPageProps {
  params: {
    id: string
  }
}

export default async function ProviderDetailPage({
  params,
}: ProviderDetailPageProps) {
  const provider = await getProviderById({ id: params.id })

  if (!provider) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin/providers" className="hover:underline">
            Providers
          </Link>
          <span>/</span>
          <span>{provider.name}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Edit Provider
          </h1>
          <DeleteProviderButton providerId={provider.id} />
        </div>
      </div>

      <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <ProviderForm provider={provider} mode="edit" />
      </div>
    </div>
  )
}
