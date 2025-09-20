'use client'

import { useState } from 'react'
import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@heroui/react'
import { Trash2 } from 'lucide-react'
import { FetchDelete } from '@/utils/fetch'
import { ErrorHandler } from '@/utils/errorHandler'
import { useUserStore } from '@/store/userStore'
import type { ResourcePlayLink } from '@/types/api/resource-play-link'

interface Props {
  resource: ResourcePlayLink
  onDelete?: (resourceId: number) => void
}

export const ResourcePlayLinkDelete = ({ resource, onDelete }: Props) => {
  const currentUser = useUserStore((state) => state.user)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleDeleteResource = async () => {
    if (onDelete) {
      onDelete(resource.id)
    }
    onClose()
  }

  return (
    <>
      <Button
        isIconOnly
        size="sm"
        color="danger"
        variant="light"
        onPress={onOpen}
        isDisabled={currentUser.role < 3}
      >
        <Trash2 size={16} />
      </Button>

      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>删除播放链接: {resource.accordion}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-danger">⚠️ 危险操作</h2>
                <p className="text-danger-700">
                  您确定要删除第 <strong>{resource.accordion}</strong> 集的播放链接吗？
                </p>
              </div>

              <div className="bg-default-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">此操作将会：</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-default-600">
                  <li>永久删除第 <strong>{resource.accordion}</strong> 集的播放链接</li>
                  <li>此操作<strong>不可撤销</strong></li>
                </ul>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              取消
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteResource}
            >
              确认删除
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
} 