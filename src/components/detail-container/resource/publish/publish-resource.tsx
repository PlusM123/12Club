'use client'

import { z } from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@heroui/button'
import { ModalBody, ModalContent, ModalFooter } from '@heroui/react'
import toast from 'react-hot-toast'
import { FetchPost } from '@/utils/fetch'
import { patchResourceCreateSchema } from '@/validations/patch'
import { ResourceLinksInput } from './resource-links-input'
import { ResourceDetailsForm } from './resource-details-form'
import { ResourceTypeSelect } from './resource-type-select'
import { ResourceSectionSelect } from './resource-section-select'
import { Upload } from 'lucide-react'
// import { FileUploadContainer } from '../upload/FileUploadContainer'
import { ErrorHandler } from '@/utils/errorHandler'
import { useUserStore } from '@/store/userStore'
import type { PatchResource } from '@/types/api/patch'

export type ResourceFormData = z.infer<typeof patchResourceCreateSchema>

interface CreateResourceProps {
  dbId: string
  onClose: () => void
  onSuccess?: (res: PatchResource) => void
}

const userRoleStorageMap: Record<number, string> = {
  1: 'user',
  2: 'user',
  3: 'alist',
  4: 'alist'
}

export const PublishResource = ({
  dbId,
  onClose,
  onSuccess
}: CreateResourceProps) => {
  const [creating, setCreating] = useState(false)
  const user = useUserStore((state) => state.user)

  const {
    control,
    reset,
    setValue,
    formState: { errors },
    watch
  } = useForm<ResourceFormData>({
    resolver: zodResolver(patchResourceCreateSchema),
    defaultValues: {
      dbId,
      storage: userRoleStorageMap[user.role],
      name: '',
      section: user.role > 2 ? 'club' : 'individual',
      hash: '',
      content: '',
      code: '',
      language: [],
      size: '',
      password: '',
      note: ''
    }
  })

  const handleRewriteResource = async () => {
    setCreating(true)
    const res = await FetchPost<PatchResource>('/patch', watch())
    setCreating(false)
    ErrorHandler(res, (value) => {
      reset()
      onSuccess?.(value)
      toast.success('资源发布成功')
    })
  }

  return (
    <ModalContent>
      <ModalBody>
        <form className="space-y-6">
          <ResourceSectionSelect
            errors={errors}
            section={watch().section}
            userRole={user.role}
            setSection={(content) => {
              setValue('section', content)
              setValue('storage', userRoleStorageMap[user.role])
            }}
          />

          <ResourceTypeSelect
            section={watch().section}
            control={control}
            errors={errors}
          />

          {(watch().storage !== 's3' || watch().content) && (
            <ResourceLinksInput
              errors={errors}
              storage={watch().storage}
              content={watch().content}
              size={watch().size}
              setContent={(content) => setValue('content', content)}
              setSize={(size) => setValue('size', size)}
            />
          )}

          <ResourceDetailsForm control={control} errors={errors} />
        </form>
      </ModalBody>

      <ModalFooter className="flex-col items-end">
        <div className="space-x-2">
          <Button color="danger" variant="light" onPress={onClose}>
            取消
          </Button>
          <Button
            color="primary"
            disabled={creating}
            isLoading={creating}
            endContent={<Upload className="size-4" />}
            onPress={handleRewriteResource}
          >
            发布资源
          </Button>
        </div>

        {creating && (
          <>
            <p>
              我们正在将您的补丁从服务器同步到云端, 请稍后 ...
              取决于您的网络环境, 这也许需要一段时间
            </p>
          </>
        )}
      </ModalFooter>
    </ModalContent>
  )
}
