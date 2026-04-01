import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ComplaintDetail from './ComplaintDetail'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const complaint = await prisma.complaint.findUnique({
    where: { id },
  })

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
      images: complaint.imageUrl
        ? [{ url: `${baseUrl}${complaint.imageUrl}`, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: complaint.imageUrl ? 'summary_large_image' : 'summary',
      title: complaint.title,
      description,
    },
  }
}

export default async function ComplaintPage({ params }: Props) {
  const { id } = await params
  const complaint = await prisma.complaint.findUnique({
    where: { id },
  })

  if (!complaint) notFound()

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
