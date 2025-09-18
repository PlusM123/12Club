'use client'

import { Chip } from '@heroui/react'
import { Image } from '@heroui/react'
import Link from 'next/link'
import { formatDistanceToNow } from '@/utils/time'
import { SelfUser } from '@/components/common/user-card/User'
import { ResourceEdit } from './ResourceEdit'
import { ResourceDelete } from './ResourceDelete'
import type { AdminResource } from '@/types/api/admin'
import { getRouteByDbId } from '@/utils/router'
import { Tooltip } from '@heroui/react'
import { Eye, Download, MessageSquare, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/utils/formatNumber'

export const RenderCell = (
  resource: AdminResource,
  columnKey: string,
  onDelete?: (resourceId: number) => void,
  onUpdate?: (resourceId: number, updatedResource: Partial<AdminResource>) => void
) => {
  switch (columnKey) {
    case 'banner':
      return (
        <Image
          alt={resource.name}
          className="object-cover rounded-none"
          width={90}
          src={
            resource.banner
              ? resource.banner.replace(/\.avif$/, '-mini.avif')
              : '/touchgal.avif'
          }
          style={{ aspectRatio: '3/4' }}
        />
      )
    case 'name':
      return (
        <Link
          href={getRouteByDbId(resource.dbId)}
          className="font-medium hover:text-primary"
        >
          <p className="truncate">{resource.name}</p>
          <p className="text-xs text-gray-400">{resource.dbId}</p>
        </Link>
      )
    case 'user':
      return (
        <SelfUser
          user={resource.user}
          userProps={{
            name: resource.user.name,
            avatarProps: {
              src: resource.user.avatar
            }
          }}
        />
      )
    case 'created':
      return (
        <Chip size="sm" variant="light">
          {formatDistanceToNow(resource.created)}
        </Chip>
      )
    case 'actions':
      return (
        <div className="flex items-center gap-2">
          <ResourceEdit
            initialResource={resource}
            onUpdate={onUpdate}
          />
          <ResourceDelete
            resource={resource}
            onDelete={onDelete}
          />
        </div>
      )
    case 'status':
      return (
        <div
          className={cn(
            'flex flex-wrap gap-4 justify-start text-sm text-default-500'
          )}
        >
          <Tooltip content="浏览数" placement="bottom">
            <div className="flex items-center gap-1">
              <Eye className="size-4" />
              <span>{formatNumber(resource.view || 0)}</span>
            </div>
          </Tooltip>

          <Tooltip content="下载数" placement="bottom">
            <div className="flex items-center gap-1">
              <Download className="size-4" />
              <span>{formatNumber(resource.download || 0)}</span>
            </div>
          </Tooltip>

          <Tooltip content="评论数" placement="bottom">
            <div className="flex items-center gap-1">
              <MessageSquare className="size-4" />
              <span>{formatNumber(resource.comment || 0)}</span>
            </div>
          </Tooltip>

          <Tooltip content="收藏数" placement="bottom">
            <div className="flex items-center gap-1">
              <Heart className="size-4" />
              <span>{formatNumber(resource.favorite_by || 0)}</span>
            </div>
          </Tooltip>
        </div>
      )
    default:
      return (
        <Chip color="primary" variant="flat">
          咕咕咕
        </Chip>
      )
  }
}
