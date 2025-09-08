'use client'
import { HomeComments } from '@/types/common/home'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  User,
  Link
} from '@heroui/react'
import { formatDistanceToNow } from '@/utils/formatDistanceToNow'
import { LinkIcon } from 'lucide-react'
import { getRouteByDbId } from '@/utils/router'

export default function CommentCard({ data }: { data: HomeComments }) {
  return (
    <Card shadow="sm">
      <CardHeader className="justify-between">
        <User
          avatarProps={{ src: data.user?.avatar }}
          description={formatDistanceToNow(data.created)}
          name={data.user?.name}
        />
      </CardHeader>
      <CardBody className="px-3 py-0 text-small">
        <p className="overflow-hidden line-clamp-3">{data.content}</p>
      </CardBody>
      <CardFooter>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">发布于</p>
          <Link
            isExternal
            showAnchorIcon
            anchorIcon={<LinkIcon size={16} />}
            className="text-small"
            href={getRouteByDbId(data.resource?.db_id || '')}
          >
            {data.resource?.name}
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
