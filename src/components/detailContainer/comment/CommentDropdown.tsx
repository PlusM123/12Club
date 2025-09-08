'use client'

import { SetStateAction, useState } from 'react'
import { Button } from '@heroui/button'
import { Dropdown, DropdownMenu, DropdownTrigger } from '@heroui/dropdown'
import { MoreHorizontal, Pencil, Trash2, TriangleAlert } from 'lucide-react'
import { DropdownItem } from '@heroui/dropdown'
import {
  addToast,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@heroui/react'
import { useUserStore } from '@/store/userStore'
import { Textarea } from '@heroui/input'

import { ErrorHandler } from '@/utils/errorHandler'
import { FetchDelete } from '@/utils/fetch'
import type { ResourceComment } from '@/types/api/comment'

interface Props {
  comment: ResourceComment
  setComments: (comments: SetStateAction<ResourceComment[]>) => void
}

export const CommentDropdown = ({ comment, setComments }: Props) => {
  const { user } = useUserStore((state) => state)
  const [editContent, setEditContent] = useState('')
  const [updating, setUpdating] = useState(false)
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete
  } = useDisclosure()
  const handleDeleteComment = async () => {
    setDeleting(true)
    const res = await FetchDelete<{ comment: ResourceComment[] }>(
      '/detail/comment',
      {
        commentId: comment.id,
        resourceId: comment.resourceId
      }
    )
    ErrorHandler(res, () => {
      onCloseDelete()
      setComments(res.comment)
      addToast({
        title: '成功',
        description: '评论删除成功',
        color: 'success'
      })
    })
    setDeleting(false)
  }

  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit
  } = useDisclosure()

  const {
    isOpen: isOpenReport,
    onOpen: onOpenReport,
    onClose: onCloseReport
  } = useDisclosure()
  const [deleting, setDeleting] = useState(false)

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="light" isIconOnly className="text-default-400">
            <MoreHorizontal aria-label="Galgame 评论操作" className="size-4" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Comment actions"
          disabledKeys={
            user.uid !== comment.userId && user.role < 3
              ? ['edit', 'delete']
              : ['report']
          }
        >
          <DropdownItem
            key="edit"
            color="default"
            startContent={<Pencil className="size-4" />}
            onPress={onOpenEdit}
          >
            编辑评论
          </DropdownItem>
          <DropdownItem
            key="delete"
            className="text-danger"
            color="danger"
            startContent={<Trash2 className="size-4" />}
            onPress={onOpenDelete}
          >
            删除评论
          </DropdownItem>
          <DropdownItem
            key="report"
            startContent={<TriangleAlert className="size-4" />}
            onPress={onOpenReport}
          >
            举报评论
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            重新编辑评论
          </ModalHeader>
          <ModalBody>
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              minRows={2}
              maxRows={8}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCloseEdit}>
              取消
            </Button>
            <Button color="primary" isDisabled={updating} isLoading={updating}>
              保存
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenDelete} onClose={onCloseDelete} placement="center">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">删除评论</ModalHeader>
          <ModalBody>
            <p>
              您确定要删除这条评论吗, 这将会删除该评论,
              以及所有回复该评论的评论, 该操作不可撤销
            </p>
            <p className="pl-4 border-l-4 border-primary-500">
              {comment.content}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCloseDelete}>
              取消
            </Button>
            <Button
              color="danger"
              disabled={deleting}
              onPress={handleDeleteComment}
              isLoading={deleting}
            >
              删除
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenReport} onClose={onCloseReport}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">举报评论</ModalHeader>
          <ModalBody>
            <Textarea isRequired placeholder="请填写举报原因" />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCloseReport}>
              取消
            </Button>
            <Button color="primary">提交</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
