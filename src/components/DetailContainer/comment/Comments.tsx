'use client'
import { useState, useEffect } from 'react'
import { User } from '@heroui/user'
import { Button } from '@heroui/button'
import { FetchGet } from '@/utils/fetch'
import { Card, CardBody } from '@heroui/card'
import { PublishComment } from './PublishComment'
import { CommentDropdown } from './CommentDropdown'
import { useUserStore } from '@/store/userStore'
import { CommentLikeButton } from './CommentLike'
import { ThumbsUp, MessageCircle, Quote } from 'lucide-react'
import { Loading } from '@/components/common/Loading'
import { ResourceComment } from '@/types/api/comment'
import { scrollIntoComment } from './_scrollIntoComment'
import { formatDistanceToNow } from '@/utils/formatDistanceToNow'
import { cn } from '@/lib/utils'

interface Props {
  id: string
}

export type Comment = {
  id: number
  like?: number
  content: string
  replies?: Comment[]
  user?: {
    name: string
    description?: string
    avatar: string
  }
}

export const Comments = ({ id }: Props) => {
  const [comments, setComments] = useState<ResourceComment[]>([])
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const user = useUserStore((state) => state.user)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (!user.uid) {
      return
    }

    const fetchData = async () => {
      const res = await FetchGet<{ comment: ResourceComment[] }>(
        '/detail/comment',
        {
          id
        }
      )
      setComments(res.comment)
      setTimeout(() => setIsLoading(false), 1000)
    }
    setIsLoading(true)
    fetchData()
  }, [])

  const setNewComment = async (
    newComment: ResourceComment[],
    newCommentId: number
  ) => {
    setReplyTo(null)
    setComments(newComment)
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })
    scrollIntoComment(newCommentId)
  }

  const renderComments = (comments: ResourceComment[], depth = 0) =>
    comments?.map((comment: ResourceComment) => {
      if (comment.parentId && depth === 0) return null

      return (
        <div
          key={comment.id}
          className={cn(
            depth <= 3 && depth !== 0 ? `ml-4` : 'ml-0',
            'space-y-4'
          )}
        >
          <Card id={`comment-${comment.id}`}>
            <CardBody>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <User
                    avatarProps={{ src: comment.user?.avatar }}
                    description={formatDistanceToNow(comment.created)}
                    name={comment.user?.name}
                  />
                  <CommentDropdown
                    comment={comment}
                    setComments={setComments}
                  />
                </div>

                {comment?.parentComment && (
                  <code
                    onClick={() =>
                      scrollIntoComment(
                        comment.parentComment && comment.parentComment.id
                      )
                    }
                    className="px-2 py-1 h-fit font-mono font-normal inline-block whitespace-nowrap bg-primary/20 text-primary-600 text-small rounded-small cursor-pointer"
                  >
                    <span>{comment.parentComment.user?.name}</span>
                    <div className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 h-7 text-small rounded-full bg-transparent text-default-foreground">
                      <span className="flex-1 text-inherit font-normal px-2 pr-1">
                        {comment.parentComment.content}
                      </span>
                      <Quote className="text-primary-600" size={16} />
                    </div>
                  </code>
                )}

                <p className="text-md py-3">{comment.content}</p>

                <div className="flex gap-2">
                  {/* <CommentLikeButton comment={comment} /> */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onPress={() =>
                      setReplyTo(replyTo === comment.id ? null : comment.id)
                    }
                  >
                    <MessageCircle className="size-4" />
                    回复
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          {replyTo === comment.id && (
            <div className="mt-2 ml-8">
              <PublishComment
                id={id}
                parentId={comment.id}
                setNewComment={setNewComment}
              />
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <>{renderComments(comment.replies, depth + 1)}</>
          )}
        </div>
      )
    })

  return (
    <div className="space-y-4">
      <PublishComment id={id} setNewComment={setNewComment} />
      {isLoading ? (
        <Loading hint="评论加载中..." />
      ) : (
        <>{renderComments(comments)}</>
      )}
    </div>
  )
}
