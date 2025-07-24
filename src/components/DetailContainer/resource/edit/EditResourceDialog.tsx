'use client'

import { z } from 'zod'
import { Button } from '@heroui/button'
import {
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from '@heroui/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { FetchPut } from '@/utils/fetch'
import { patchResourceCreateSchema } from '@/validations/patch'
import { ResourceLinksInput } from '../publish/ResourceLinksInput'
import { ErrorHandler } from '@/utils/errorHandler'
import { ResourceDetailsForm } from '../publish/ResourceDetailsForm'
import type { PatchResource } from '@/types/api/patch'
import { useUserStore } from '@/store/userStore'

type EditResourceFormData = z.infer<typeof patchResourceCreateSchema>

interface EditResourceDialogProps {
  resource: PatchResource
  onClose: () => void
  onSuccess: (resource: PatchResource) => void
}

export const EditResourceDialog = ({
  resource,
  onClose,
  onSuccess
}: EditResourceDialogProps) => {
  const user = useUserStore((state) => state.user)
  const [editing, setEditing] = useState(false)

  const {
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<EditResourceFormData>({
    resolver: zodResolver(patchResourceCreateSchema),
    defaultValues: resource
  })

  const handleUpdateResource = async () => {
    setEditing(true)
    const res = await FetchPut<PatchResource>(`/patch`, {
      patchId: resource.id,
      ...watch()
    })
    ErrorHandler(res, (value) => {
      onSuccess(value)
      toast.success('资源更新成功')
    })
    setEditing(false)
  }

  return (
    <ModalContent>
      <ModalHeader className="flex-col space-y-2">
        <h3 className="text-lg">资源编辑</h3>
        {user.role > 2 && (
          <p className="text-sm text-default-500">
            12club资源盘更换链接还需要在alist中进行修改
          </p>
        )}
      </ModalHeader>

      <ModalBody>
        <form className="space-y-6">
          <ResourceLinksInput
            errors={errors}
            storage={watch().storage}
            content={watch().content}
            size={watch().size}
            setContent={(content) => setValue('content', content)}
            setSize={(size) => setValue('size', size)}
          />
          <ResourceDetailsForm control={control} errors={errors} />
        </form>
      </ModalBody>

      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          取消
        </Button>
        <Button
          color="primary"
          disabled={editing}
          isLoading={editing}
          onPress={handleUpdateResource}
        >
          保存
        </Button>
      </ModalFooter>
    </ModalContent>
  )
}
