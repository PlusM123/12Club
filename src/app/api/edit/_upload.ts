import sharp from 'sharp'
import { uploadImageToS3 } from '@/lib/s3'

export const uploadResourceImage = async (image: ArrayBuffer, id: string) => {
  const imageBuffer = Buffer.from(image)
  const banner = await sharp(imageBuffer)
    .resize(300, 400, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .avif({ quality: 60 })
    .toBuffer()
  const miniBanner = await sharp(imageBuffer)
    .resize(120, 160, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .avif({ quality: 60 })
    .toBuffer()

  const bucketName = `resource/${id}`

  await uploadImageToS3(`${bucketName}/banner.avif`, banner)
  await uploadImageToS3(`${bucketName}/banner-mini.avif`, miniBanner)
}
