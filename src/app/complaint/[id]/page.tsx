import { getComplaint } from '@/lib/actions'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ComplaintDetail from './ComplaintDetail'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const complaint = await getComplaint(id)

  if (!complaint) return { title: 'Complaint Not Found' }

  const description = complaint.description.slice(0, 160)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  return {
    title: `${complaint.title} | Pugaar Petti`,
    description,
    openGraph: {
      title: complaint.title,
      description,
      type: 'article',
      images: complaint.hasImage
        ? [{ url: `${baseUrl}/api/image/${id}`, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: complaint.hasImage ? 'summary_large_image' : 'summary',
      title: complaint.title,
      description,
    },
  }
}

export default async function ComplaintPage({ params }: Props) {
  const { id } = await params
  const complaint = await getComplaint(id)

  if (!complaint || complaint.status === 'removed') notFound()

  return (
    <ComplaintDetail
      complaint={{
        ...complaint,
        createdAt: complaint.createdAt.toISOString(),
        updatedAt: complaint.updatedAt.toISOString(),
        repliedAt: complaint.repliedAt?.toISOString() || null,
      }}
    />
  )
}
