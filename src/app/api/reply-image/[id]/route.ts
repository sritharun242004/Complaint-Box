import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const complaint = await prisma.complaint.findUnique({
    where: { id },
    select: { adminReplyImage: true },
  })

  if (!complaint?.adminReplyImage) {
    return new NextResponse(null, { status: 404 })
  }

  const { adminReplyImage } = complaint

  if (adminReplyImage.startsWith('data:')) {
    const match = adminReplyImage.match(/^data:(.+?);base64,(.+)$/)
    if (!match) return new NextResponse(null, { status: 400 })

    const mimeType = match[1]
    const buffer = Buffer.from(match[2], 'base64')

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString(),
      },
    })
  }

  return NextResponse.redirect(adminReplyImage, {
    status: 302,
    headers: { 'Cache-Control': 'public, max-age=86400' },
  })
}
