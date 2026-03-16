import { getAllLocations } from "@/actions/location"
import { LocationForm } from "@/components/forms/location/location-form"
import { LocationRow } from "./location-row"

export default async function LocationsPage() {
  const locations = await getAllLocations()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Locations
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage cities and regions where services are offered
        </p>
      </div>

      {/* Add Location Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-medium text-gray-900">
          Add New Location
        </h2>
        <LocationForm />
      </div>

      {/* Locations List */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {locations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    City
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Region
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Active
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Created
                  </th>
                  <th className="px-6 py-3 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => (
                  <LocationRow key={location.id} location={location} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-sm text-muted-foreground">
            No locations yet. Add your first location above.
          </div>
        )}
      </div>
    </div>
  )
}
