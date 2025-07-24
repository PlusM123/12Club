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
          className="font-medium hover:text-primary-500"
        >
          {resource.name}
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
    default:
      return (
        <Chip color="primary" variant="flat">
          咕咕咕
        </Chip>
      )
  }
}
