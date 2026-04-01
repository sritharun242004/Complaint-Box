'use server'

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuid } from 'uuid'

const badWords = ['abuse', 'spam', 'hack']
function containsBadWords(text: string): boolean {
  const lower = text.toLowerCase()
  return badWords.some(w => lower.includes(w))
}

export async function createComplaint(formData: FormData) {
  const name = formData.get('name') as string
  const mobile = formData.get('mobile') as string
  const area = formData.get('area') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const location = formData.get('location') as string | null
  const latitude = formData.get('latitude') as string | null
  const longitude = formData.get('longitude') as string | null
  const photo = formData.get('photo') as File | null

  if (!name || !mobile || !area || !title || !description || !category) {
    return { error: 'All fields are required' }
  }

  if (!/^\d{10}$/.test(mobile)) {
    return { error: 'Mobile number must be 10 digits' }
  }

  if (containsBadWords(title) || containsBadWords(description)) {
    return { error: 'Your submission contains inappropriate content' }
  }

  // ONE COMPLAINT PER MOBILE NUMBER
  const existing = await prisma.complaint.findUnique({ where: { mobile } })
  if (existing) {
    return { error: 'You have already submitted a complaint with this mobile number. Only one complaint per person is allowed.' }
  }

  let imageUrl: string | null = null

  if (photo && photo.size > 0) {
    const bytes = await photo.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = photo.name.split('.').pop() || 'jpg'
    const filename = `${uuid()}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, filename), buffer)
    imageUrl = `/uploads/${filename}`
  }

  const complaint = await prisma.complaint.create({
    data: {
      name,
      mobile,
      area,
      title,
      description,
      category,
      imageUrl,
      location: location || null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
    },
  })

  revalidatePath('/pugaar-petti')
  redirect(`/complaint/${complaint.id}`)
}

export async function getComplaints(filters?: {
  area?: string
  category?: string
  sort?: 'recent' | 'popular'
}) {
  const where: Record<string, string> = {}
  if (filters?.area) where.area = filters.area
  if (filters?.category) where.category = filters.category

  const orderBy = filters?.sort === 'popular'
    ? { upvotes: 'desc' as const }
    : { createdAt: 'desc' as const }

  return prisma.complaint.findMany({
    where,
    orderBy,
    take: 50,
  })
}

export async function getComplaint(id: string) {
  return prisma.complaint.findUnique({ where: { id } })
}

export async function upvoteComplaint(complaintId: string, mobile: string) {
  if (!/^\d{10}$/.test(mobile)) {
    return { error: 'Invalid mobile number' }
  }

  const existingVote = await prisma.vote.findUnique({
    where: { complaintId_mobile: { complaintId, mobile } },
  })

  if (existingVote) return { error: 'You have already supported this complaint' }

  await prisma.$transaction([
    prisma.vote.create({ data: { complaintId, mobile } }),
    prisma.complaint.update({ where: { id: complaintId }, data: { upvotes: { increment: 1 } } }),
  ])

  revalidatePath('/pugaar-petti')
  revalidatePath(`/complaint/${complaintId}`)

  return { success: true }
}

// ============ ADMIN ACTIONS ============

export async function getAllComplaints() {
  return prisma.complaint.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { votes: true } } },
  })
}

export async function adminReply(complaintId: string, reply: string) {
  if (!reply.trim()) return { error: 'Reply cannot be empty' }

  await prisma.complaint.update({
    where: { id: complaintId },
    data: { adminReply: reply.trim(), repliedAt: new Date(), status: 'reviewed' },
  })

  revalidatePath('/pugaar-petti')
  revalidatePath(`/complaint/${complaintId}`)
  revalidatePath('/admin')

  return { success: true }
}

export async function updateComplaintStatus(complaintId: string, status: 'pending' | 'reviewed' | 'resolved') {
  await prisma.complaint.update({
    where: { id: complaintId },
    data: { status },
  })

  revalidatePath('/pugaar-petti')
  revalidatePath(`/complaint/${complaintId}`)
  revalidatePath('/admin')

  return { success: true }
}

export async function deleteComplaint(complaintId: string) {
  await prisma.complaint.delete({ where: { id: complaintId } })

  revalidatePath('/pugaar-petti')
  revalidatePath('/admin')

  return { success: true }
}
