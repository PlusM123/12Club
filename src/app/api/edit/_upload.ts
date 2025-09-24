import sharp from 'sharp'
import { uploadImageToS3 } from '@/lib/s3'

export const uploadResourceImage = async (image: ArrayBuffer, id: string) => {
  const imageBuffer = Buffer.from(image)
  const banner = await sharp(imageBuffer)
    .resize(600, 800, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .avif({ quality: 100 })
    .toBuffer()

  const bucketName = `resource/${id}`

  await uploadImageToS3(`${bucketName}/banner.avif`, banner)
}
