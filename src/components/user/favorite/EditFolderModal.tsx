'use client'

import { useState, useTransition } from 'react'
import {
  Button,
  Checkbox,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure
} from '@heroui/react'
import { Pencil, Plus } from 'lucide-react'
import { FetchPost, FetchPut } from '@/utils/fetch'
import toast from 'react-hot-toast'
import { ErrorHandler } from '@/utils/errorHandler'
import type { UserFavoriteResourceFolder } from '@/types/api/user'

interface Props {
  action: 'create' | 'update'
  folderId?: number
  folder?: UserFavoriteResourceFolder
  onActionSuccess: (folder: UserFavoriteResourceFolder) => void
}

export const EditFolderModal = ({
  action,
  folderId,
  folder,
  onActionSuccess
}: Props) => {
  const [isPending, startTransition] = useTransition()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [newFolder, setNewFolder] = useState({
    name: folder?.name ?? '',
    description: folder?.description ?? '',
    isPublic: !!folder?.is_public
  })

  const handleCreateFolder = async () => {
    startTransition(async () => {
      let res: UserFavoriteResourceFolder | null = null

      if (action === 'create') {
        res = await FetchPost<UserFavoriteResourceFolder>(
          '/user/profile/favorite/folder',
          newFolder
        )
      } else {
        res = await FetchPut<UserFavoriteResourceFolder>(
          '/user/profile/favorite/folder',
          { folderId, ...newFolder }
        )
      }

      ErrorHandler(res, (value) => {
        onActionSuccess(value)
        toast.success(
          action === 'create' ? '创建收藏文件夹成功' : '编辑收藏文件夹成功'
        )
        setNewFolder({ name: '', description: '', isPublic: false })
        onClose()
      })
    })
  }

  return (
    <>
      <Button
        startContent={
          action === 'create' ? (
            <Plus className="w-4 h-4" />
          ) : (
            <Pencil className="w-4 h-4" />
          )
        }
        color="primary"
        variant="flat"
        onPress={onOpen}
      >
        {action === 'create' ? '创建新收藏夹' : '编辑'}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            {action === 'create' ? '创建新收藏夹' : '编辑收藏夹'}
          </ModalHeader>
          <ModalBody>
            <Input
              label="名称"
              value={newFolder.name}
              onChange={(e) =>
                setNewFolder({ ...newFolder, name: e.target.value })
              }
            />
            <Textarea
              label="描述"
              value={newFolder.description}
              onChange={(e) =>
                setNewFolder({ ...newFolder, description: e.target.value })
              }
            />
            <Checkbox
              isSelected={newFolder.isPublic}
              onValueChange={(value) =>
                setNewFolder({ ...newFolder, isPublic: value })
              }
            >
              公开收藏夹
            </Checkbox>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              取消
            </Button>
            <Button
              color="primary"
              onPress={handleCreateFolder}
              isLoading={isPending}
            >
              {action === 'create' ? '创建' : '更新'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
