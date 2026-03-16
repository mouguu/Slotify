import Link from "next/link"

import { ProviderForm } from "@/components/forms/provider/provider-form"

export default function NewProviderPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/admin/providers" className="hover:underline">
            Providers
          </Link>
          <span>/</span>
          <span>New</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
          Add Provider
        </h1>
      </div>

      <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <ProviderForm mode="add" />
      </div>
    </div>
  )
}
