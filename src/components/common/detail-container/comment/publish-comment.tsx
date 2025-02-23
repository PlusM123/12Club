'use client'

import { useState } from 'react'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Textarea } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { Send } from 'lucide-react'

interface CreateCommentProps {
  onSuccess?: () => void
}

export const PublishComment = ({ onSuccess }: CreateCommentProps) => {
  const [content, setContent] = useState('')

  return (
    <Card>
      <CardHeader className="pb-0 space-x-4"></CardHeader>
      <CardBody className="space-y-4">
        <Textarea label="评论输入框" />
        <div className="flex items-center justify-end">
          <Button color="primary" startContent={<Send className="size-4" />}>
            发布评论
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}
