import { getAllServices } from "@/actions/service"
import { ServiceForm } from "@/components/forms/service/service-form"
import { ServiceRow } from "./service-row"

export default async function ServicesPage() {
  const services = await getAllServices()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Services
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your available services
        </p>
      </div>

      {/* Add Service Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-medium text-gray-900">
          Add New Service
        </h2>
        <ServiceForm />
      </div>

      {/* Services List */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {services.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Duration
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Active
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <ServiceRow key={service.id} service={service} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            No services yet. Add your first service above.
          </div>
        )}
      </div>
    </div>
  )
}
