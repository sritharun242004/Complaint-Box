import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const prisma = new PrismaClient()
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})
const BUCKET = process.env.AWS_S3_BUCKET!

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  }
  return map[mime] || 'jpg'
}

async function uploadToS3(buffer: Buffer, key: string, contentType: string): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  )
  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
}

function parseDataUri(dataUri: string): { buffer: Buffer; mimeType: string } | null {
  const match = dataUri.match(/^data:(.+?);base64,(.+)$/)
  if (!match) return null
  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], 'base64'),
  }
}

async function main() {
  const complaints = await prisma.complaint.findMany({
    select: { id: true, imageUrl: true, adminReplyImage: true },
  })

  let migratedImages = 0
  let migratedReplies = 0
  let errors = 0

  for (const complaint of complaints) {
    // Migrate complaint image
    if (complaint.imageUrl?.startsWith('data:')) {
      const parsed = parseDataUri(complaint.imageUrl)
      if (parsed) {
        try {
          const ext = extFromMime(parsed.mimeType)
          const key = `complaints/${complaint.id}-${Date.now()}.${ext}`
          const url = await uploadToS3(parsed.buffer, key, parsed.mimeType)
          await prisma.complaint.update({
            where: { id: complaint.id },
            data: { imageUrl: url },
          })
          migratedImages++
          console.log(`  [image] ${complaint.id} -> ${key}`)
        } catch (err) {
          errors++
          console.error(`  [error] image ${complaint.id}:`, err)
        }
      }
    }

    // Migrate admin reply image
    if (complaint.adminReplyImage?.startsWith('data:')) {
      const parsed = parseDataUri(complaint.adminReplyImage)
      if (parsed) {
        try {
          const ext = extFromMime(parsed.mimeType)
          const key = `replies/${complaint.id}-${Date.now()}.${ext}`
          const url = await uploadToS3(parsed.buffer, key, parsed.mimeType)
          await prisma.complaint.update({
            where: { id: complaint.id },
            data: { adminReplyImage: url },
          })
          migratedReplies++
          console.log(`  [reply] ${complaint.id} -> ${key}`)
        } catch (err) {
          errors++
          console.error(`  [error] reply ${complaint.id}:`, err)
        }
      }
    }
  }

  console.log(`\nDone: ${migratedImages} images, ${migratedReplies} reply images migrated. ${errors} errors.`)
  await prisma.$disconnect()
}

main()
