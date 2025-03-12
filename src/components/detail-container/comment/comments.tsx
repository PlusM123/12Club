'use client'
import { useState } from 'react'
import { User } from "@heroui/user"
import { Button } from "@heroui/button"
import { Card, CardBody } from "@heroui/card"
import { PublishComment } from './publish-comment'
import { CommentDropdown } from './comment-dropdown'
import { CommentLikeButton } from './comment-like'
import { ThumbsUp, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  id?: number
}

type Comment = {
  id: number
  like: number
  content: string
  replies?: Comment[]
  user?: {
    name: string
    description?: string
    avatar: string
  }
}

const comments: Comment[] = [
  {
    id: 1,
    like: 4,
    content: '很喜欢这部作品，我特么社保！',
    user: {
      name: '长期素食',
      avatar: '/favicon.ico'
    }
  },
  {
    id: 2,
    like: 0,
    content: '那么久了终于更新了',
    user: {
      name: '千早爱音',
      avatar: '/favicon.ico'
    }
  }
]

export const Comments = ({ id }: Props) => {
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [liked, setLiked] = useState(false)
  const renderComments = (comments: any) => {
    return comments.map((comment: any) => (
      <div key={comment.id}>
        <Card id={`comment-${comment.id}`} className="border-none shadow-none">
          <CardBody className="px-0">
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <User
                  avatarProps={{ src: comment.user?.avatar }}
                  description={comment.user?.description}
                  name={comment.user?.name}
                />
                <CommentDropdown comment={comment} />
              </div>

              <div className="text-sm text-default-500">{comment.content}</div>

              <div className="flex gap-2 mt-2">
                <CommentLikeButton comment={comment} />
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
            <PublishComment />
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className="space-y-4">
      <PublishComment />
      {renderComments(comments)}
    </div>
  )
}
