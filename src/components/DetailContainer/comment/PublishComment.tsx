'use client'

import { useState } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Textarea } from '@heroui/input'
import { Button, addToast } from '@heroui/react'
import { Send } from 'lucide-react'
import { ErrorHandler } from '@/utils/errorHandler'
import { FetchPost } from '@/utils/fetch'
import type { ResourceComment } from '@/types/api/comment'

interface CreateCommentProps {
  id: string
  parentId?: number | null
  setNewComment: (newComment: ResourceComment[], newCommentId: number) => void
  onSuccess?: () => void
}

export const PublishComment = ({
  id,
  parentId = null,
  setNewComment,
  onSuccess
}: CreateCommentProps) => {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const handlePublishComment = async () => {
    setLoading(true)
    const res = await FetchPost<{
      comment: ResourceComment[]
      newCommentId: number
    }>('/detail/comment', {
      id,
      parentId,
      content: content.trim()
    })
    ErrorHandler(res, (value) => {
      setNewComment(value.comment, value.newCommentId)
      addToast({
        title: '成功',
        description: '评论发布成功',
        color: 'success'
      })
      setContent('')
      onSuccess?.()
    })

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader className="pb-0 space-x-4"></CardHeader>
      <CardBody className="space-y-4">
        <Textarea
          label="评论输入框"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex items-center justify-end">
          <Button
            color="primary"
            onPress={handlePublishComment}
            startContent={<Send className="size-4" />}
          >
            发布评论
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}
