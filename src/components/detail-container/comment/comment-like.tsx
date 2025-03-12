import { useState } from 'react'
import { Button } from "@heroui/button"
import { Tooltip } from "@heroui/tooltip"
import { ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  comment: any
}

export const CommentLikeButton = ({ comment }: Props) => {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(comment.like)
  const [loading, setLoading] = useState(false)

  const toggleLike = async () => {
    setLoading(false)
    liked ? setLiked(false) : setLiked(true)
    setLikeCount((prev: number) => (liked ? prev - 1 : prev + 1))
  }

  return (
    <Tooltip key="like" color="default" content="点赞" placement="bottom">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        disabled={loading}
        isLoading={loading}
        onPress={toggleLike}
      >
        <ThumbsUp className={cn('w-4 h-4', liked ? 'text-danger-500' : '')} />
        {likeCount}
      </Button>
    </Tooltip>
  )
}
