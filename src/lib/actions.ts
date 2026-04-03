'use server'

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { uploadToS3 } from './s3'

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

  // Test DB connection
  try {
    await prisma.$queryRaw`SELECT 1`
  } catch (e) {
    console.error('DB connection error:', e)
    return { error: 'Database connection failed. Please try again later.' }
  }

  let imageUrl: string | null = null

  if (photo && photo.size > 0) {
    if (photo.size > 5 * 1024 * 1024) {
      return { error: 'Image must be under 5MB' }
    }
    try {
      const bytes = await photo.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const mimeType = photo.type || 'image/jpeg'
      const ext = mimeType.split('/')[1] || 'jpg'
      const key = `complaints/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      imageUrl = await uploadToS3(buffer, key, mimeType)
    } catch (e) {
      console.error('S3 upload error:', e)
      return { error: 'Failed to upload image. Please try again.' }
    }
  }

  let complaintId: string

  try {
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
    complaintId = complaint.id
  } catch (e) {
    console.error('Failed to create complaint:', e)
    return { error: 'Failed to submit complaint. Please try again.' }
  }

  revalidatePath('/pugaar-petti')
  redirect(`/complaint/${complaintId}`)
}

// Lightweight complaint list — never sends image blobs to client
const listSelect = {
  id: true,
  name: true,
  area: true,
  title: true,
  description: true,
  category: true,
  upvotes: true,
  status: true,
  adminReply: true,
  createdAt: true,
} as const

export async function getComplaints(filters?: {
  area?: string
  category?: string
  sort?: 'recent' | 'popular'
}) {
  const where: Record<string, unknown> = { status: { not: 'removed' } }
  if (filters?.area) where.area = filters.area
  if (filters?.category) where.category = filters.category

  const orderBy = filters?.sort === 'popular'
    ? { upvotes: 'desc' as const }
    : { createdAt: 'desc' as const }

  const rows = await prisma.complaint.findMany({
    where,
    orderBy,
    take: 50,
    select: listSelect,
  })

  // Determine which have images without fetching the blob
  const ids = rows.map(r => r.id)
  const imageFlags = ids.length > 0
    ? await prisma.$queryRawUnsafe<{ id: string; has_image: boolean; has_reply_image: boolean }[]>(
        `SELECT id, image_url IS NOT NULL as has_image, admin_reply_image IS NOT NULL as has_reply_image FROM complaints WHERE id = ANY($1::text[])`,
        ids
      )
    : []
  const flagMap = new Map(imageFlags.map(r => [r.id, r]))

  return rows.map(r => {
    const flags = flagMap.get(r.id)
    return {
      ...r,
      hasImage: flags?.has_image ?? false,
      hasAdminReplyImage: flags?.has_reply_image ?? false,
    }
  })
}

export async function getComplaint(id: string) {
  const row = await prisma.complaint.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      mobile: true,
      area: true,
      title: true,
      description: true,
      category: true,
      location: true,
      latitude: true,
      longitude: true,
      upvotes: true,
      status: true,
      adminReply: true,
      repliedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!row) return null

  const flags = await prisma.$queryRawUnsafe<{ has_image: boolean; has_reply_image: boolean }[]>(
    `SELECT image_url IS NOT NULL as has_image, admin_reply_image IS NOT NULL as has_reply_image FROM complaints WHERE id = $1`,
    id
  )

  return {
    ...row,
    hasImage: flags[0]?.has_image ?? false,
    hasAdminReplyImage: flags[0]?.has_reply_image ?? false,
  }
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

export async function quickUpvote(complaintId: string) {
  await prisma.complaint.update({
    where: { id: complaintId },
    data: { upvotes: { increment: 1 } },
  })

  revalidatePath('/pugaar-petti')
  revalidatePath(`/complaint/${complaintId}`)

  return { success: true }
}

export async function quickDownvote(complaintId: string) {
  await prisma.complaint.update({
    where: { id: complaintId },
    data: { upvotes: { decrement: 1 } },
  })

  revalidatePath('/pugaar-petti')
  revalidatePath(`/complaint/${complaintId}`)

  return { success: true }
}

// ============ ADMIN ACTIONS ============

export async function getAllComplaints() {
  const rows = await prisma.complaint.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      ...listSelect,
      mobile: true,
      location: true,
      repliedAt: true,
      updatedAt: true,
      _count: { select: { votes: true } },
    },
  })

  const ids = rows.map(r => r.id)
  const imageFlags = ids.length > 0
    ? await prisma.$queryRawUnsafe<{ id: string; has_image: boolean; has_reply_image: boolean }[]>(
        `SELECT id, image_url IS NOT NULL as has_image, admin_reply_image IS NOT NULL as has_reply_image FROM complaints WHERE id = ANY($1::text[])`,
        ids
      )
    : []
  const flagMap = new Map(imageFlags.map(r => [r.id, r]))

  return rows.map(r => {
    const flags = flagMap.get(r.id)
    return {
      ...r,
      hasImage: flags?.has_image ?? false,
      hasAdminReplyImage: flags?.has_reply_image ?? false,
    }
  })
}

export async function adminReply(formData: FormData) {
  const complaintId = formData.get('complaintId') as string
  const reply = formData.get('reply') as string
  const photo = formData.get('photo') as File | null
  const removeImage = formData.get('removeImage') === 'true'

  if (!complaintId) return { error: 'Missing complaint ID' }
  if (!reply?.trim()) return { error: 'Reply cannot be empty' }

  const data: Record<string, unknown> = {
    adminReply: reply.trim(),
    repliedAt: new Date(),
    status: 'reviewed',
  }

  if (photo && photo.size > 0) {
    if (photo.size > 5 * 1024 * 1024) {
      return { error: 'Image must be under 5MB' }
    }
    try {
      const bytes = await photo.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const mimeType = photo.type || 'image/jpeg'
      const ext = mimeType.split('/')[1] || 'jpg'
      const key = `replies/${complaintId}-${Date.now()}.${ext}`
      data.adminReplyImage = await uploadToS3(buffer, key, mimeType)
    } catch (e) {
      console.error('S3 upload error for admin reply:', e)
      return { error: 'Failed to upload image. Please try again.' }
    }
  } else if (removeImage) {
    data.adminReplyImage = null
  }

  await prisma.complaint.update({
    where: { id: complaintId },
    data,
  })

  revalidatePath('/pugaar-petti')
  revalidatePath(`/complaint/${complaintId}`)
  revalidatePath('/admin')

  return { success: true }
}

export async function updateComplaintStatus(complaintId: string, status: 'pending' | 'reviewed' | 'resolved' | 'removed') {
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
