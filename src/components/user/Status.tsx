import { Card, CardBody } from '@heroui/react'
import { MessageCircle, Puzzle, Star } from 'lucide-react'
import type { UserInfo } from '@/types/api/user'

export const UserStats = ({ user }: { user: UserInfo }) => {
  const stats = [
    {
      label: '发布资源',
      value: user._count.resource_patch,
      icon: Puzzle
    },
    { label: '评论', value: user._count.resource_comment, icon: MessageCircle },
    // { label: '消息', value: user._count.send_message, icon: MessageSquareMore },
    { label: '收藏', value: user._count.resource_favorite, icon: Star }
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="w-full">
          <CardBody className="flex flex-row items-center gap-4 p-4">
            <stat.icon className="size-8 text-primary" />
            <div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-small text-default-500">{stat.label}</p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}
