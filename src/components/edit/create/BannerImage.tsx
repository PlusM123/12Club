'use client'

import { useEffect, useState } from 'react'
import localforage from 'localforage'
import { dataURItoBlob } from '@/utils/dataURItoBlob'
import { ImageCropper } from '@/components/common/cropper/ImageCropper'

interface Props {
  errors: string | undefined
}

export const BannerImage = ({ errors }: Props) => {
  const [initialUrl, setInitialUrl] = useState<string>('')


  useEffect(() => {
    const fetchData = async () => {
      const localeBannerBlob: Blob | null =
        await localforage.getItem('resource-banner')
      if (localeBannerBlob) {
        setInitialUrl(URL.createObjectURL(localeBannerBlob))
      }
    }
    fetchData()
  }, [])

  const removeBanner = async () => {
    await localforage.removeItem('resource-banner')
    setInitialUrl('')
  }

  const onImageComplete = async (croppedImage: string) => {
    const imageBlob = dataURItoBlob(croppedImage)
    await localforage.setItem('resource-banner', imageBlob)
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl">封面图片 (必须)</h2>
      {errors && <p className="text-xs text-danger-500">{errors}</p>}

      <ImageCropper
        aspect={{ x: 3, y: 4 }}
        initialImage={initialUrl}
        cropperClassName="max-w-96"
        description="您的预览图片将会被固定为 3:4 的比例"
        onImageComplete={onImageComplete}
        removeImage={removeBanner}
      />
    </div>
  )
}
