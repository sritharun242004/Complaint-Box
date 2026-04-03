import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.AWS_S3_BUCKET!

/** Compress and resize image to WebP, max 1200px wide, 80% quality */
async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()
}

export async function uploadToS3(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  // Optimize images before uploading
  const isImage = contentType.startsWith('image/')
  let finalBuffer = buffer
  let finalContentType = contentType
  let finalKey = key

  if (isImage) {
    finalBuffer = await optimizeImage(buffer)
    finalContentType = 'image/webp'
    finalKey = key.replace(/\.[^.]+$/, '.webp')
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: finalKey,
      Body: finalBuffer,
      ContentType: finalContentType,
    })
  )

  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${finalKey}`
}
