import getSession from "@/lib/auth"

export default async function ProfilePage() {
  const session = await getSession()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Your account information
        </p>
      </div>

      <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {session?.user?.name ?? "Not set"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {session?.user?.email ?? "Not set"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Role
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {session?.user?.role ?? "Unknown"}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-md border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-muted-foreground">
            Your profile settings will appear here. Additional profile
            management features are coming soon.
          </p>
        </div>
      </div>
    </div>
  )
}
