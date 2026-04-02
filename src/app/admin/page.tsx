import { getAllComplaints } from '@/lib/actions'
import { isAdminAuthenticated } from '@/lib/admin-auth'
import AdminDashboard from './AdminDashboard'
import AdminLogin from './AdminLogin'

export const metadata = {
  title: 'Admin Panel | Dr. Tamilisai Soundarajan',
  robots: 'noindex, nofollow',
}

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated()

  if (!authenticated) {
    return <AdminLogin />
  }

  const complaints = await getAllComplaints()

  return (
    <AdminDashboard
      complaints={complaints.map(c => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        repliedAt: c.repliedAt?.toISOString() || null,
        voteCount: c._count.votes,
      }))}
    />
  )
}
