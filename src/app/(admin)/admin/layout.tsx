import { Sidebar } from "@/components/admin/sidebar"
import getSession from "@/lib/auth"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({
  children,
}: Readonly<AdminLayoutProps>): Promise<JSX.Element> {
  const session = await getSession()

  return (
    <div className="flex h-screen">
      <Sidebar userEmail={session?.user?.email} />
      <main className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
        {children}
      </main>
    </div>
  )
}
