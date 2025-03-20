'use client'

import { useState } from 'react'
import { Button } from '@heroui/react'
import localforage from 'localforage'
import { useCreateResourceStore } from '@/store/editStore'
import toast from 'react-hot-toast'
import { FetchFormData } from '@/utils/fetch'
import { ErrorHandler } from '@/utils/errorHandler'
import { resourceCreateSchema } from '@/validations/edit'
import { useRouter } from 'next-nprogress-bar'
import type { Dispatch, SetStateAction } from 'react'
import type { CreateResourceRequestData } from '@/store/editStore'

interface Props {
  setErrors: Dispatch<
    SetStateAction<Partial<Record<keyof CreateResourceRequestData, string>>>
  >
}

export const PublishButton = ({ setErrors }: Props) => {
  const router = useRouter()
  const { data, resetData } = useCreateResourceStore()

  const [creating, setCreating] = useState(false)
  const handleSubmit = async () => {
    const localeBannerBlob: Blob | null =
      await localforage.getItem('resource-banner')
    if (!localeBannerBlob) {
      toast.error('未检测到预览图片')
      return
    }

    const result = resourceCreateSchema.safeParse({
      ...data,
      banner: localeBannerBlob,
      alias: JSON.stringify(data.alias)
    })
    if (!result.success) {
      const newErrors: Partial<
        Record<keyof CreateResourceRequestData, string>
      > = {}
      result.error.errors.forEach((err) => {
        if (err.path.length) {
          newErrors[err.path[0] as keyof CreateResourceRequestData] =
            err.message
          toast.error(err.message)
        }
      })
      setErrors(newErrors)
      return
    } else {
      setErrors({})
    }

    const formDataToSend = new FormData()
    formDataToSend.append('banner', localeBannerBlob!)
    formDataToSend.append('name', data.name)
    formDataToSend.append('author', data.author)
    formDataToSend.append('language', data.language)
    formDataToSend.append('accordionTotal', data.accordionTotal.toString())
    formDataToSend.append('dbId', data.dbId)
    formDataToSend.append('introduction', data.introduction)
    formDataToSend.append('alias', JSON.stringify(data.alias))
    formDataToSend.append('released', data.released)

    setCreating(true)
    toast('正在发布中 ... 这可能需要 10s 左右的时间, 这取决于您的网络环境')

    const res = await FetchFormData<{
      dbId: string
    }>('/edit', formDataToSend)
    ErrorHandler(res, async (value) => {
      // resetData()
      // await localforage.removeItem('resource-banner')
      const routerMap = {
        a: 'anime',
        c: 'comic',
        n: 'novel'
      } as const
      const prefix = value.dbId.charAt(0) as keyof typeof routerMap
      router.push(`/${routerMap[prefix]}/${value.dbId}`)
    })
    toast.success('发布完成, 正在为您跳转到资源介绍页面')
    setCreating(false)
  }

  return (
    <Button
      color="primary"
      onPress={handleSubmit}
      className="w-full mt-4"
      isDisabled={creating}
      isLoading={creating}
    >
      提交
    </Button>
  )
}
