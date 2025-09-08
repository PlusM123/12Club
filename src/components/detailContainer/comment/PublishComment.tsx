'use client'

import { useState } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Textarea } from '@heroui/input'
import { Button, addToast } from '@heroui/react'
import { Send } from 'lucide-react'
import { ErrorHandler } from '@/utils/errorHandler'
import { FetchPost } from '@/utils/fetch'
import { useUserStore } from '@/store/userStore'
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
  const user = useUserStore((state) => state.user)
  const isLoggedIn = user.uid > 0

  const handlePublishComment = async () => {
    // 防止重复提交
    if (loading) {
      return
    }

    // 验证内容
    if (!content.trim()) {
      addToast({
        title: '错误',
        description: '评论内容不能为空',
        color: 'danger'
      })
      return
    }

    setLoading(true)

    try {
      const res = await FetchPost<{
        comment: ResourceComment[]
        newCommentId: number
      }>('/detail/comment', {
        id,
        parentId: parentId || null,
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
    } catch (error) {
      addToast({
        title: '错误',
        description: '评论发布失败，请稍后重试',
        color: 'danger'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-0 space-x-4"></CardHeader>
      <CardBody className="space-y-4">
        <Textarea
          label="评论输入框"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          isDisabled={loading || !isLoggedIn}
          maxLength={10000}
          placeholder={isLoggedIn ? "请输入您的评论..." : "请先登录后再发表评论"}
        />
        <div className="flex items-center justify-end">
          <Button
            color="primary"
            onPress={handlePublishComment}
            isDisabled={loading || !content.trim() || !isLoggedIn}
            isLoading={loading}
            startContent={!loading && <Send className="size-4" />}
          >
            {loading ? '发布中...' : isLoggedIn ? '发布评论' : '请先登录'}
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}
