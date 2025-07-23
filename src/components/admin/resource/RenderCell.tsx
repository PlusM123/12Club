'use client'

import { Chip } from '@heroui/react'
import { Image } from '@heroui/react'
import Link from 'next/link'
import { formatDistanceToNow } from '@/utils/time'
import { SelfUser } from '@/components/common/user-card/user'
import type { AdminResource } from '@/types/api/admin'

export const RenderCell = (resource: AdminResource, columnKey: string) => {
  switch (columnKey) {
    case 'banner':
      return (
        <Image
          alt={resource.name}
          className="object-cover rounded-none"
          width={90}
          src={resource.banner}
          style={{ aspectRatio: '3/4' }}
        />
      )
    case 'name':
      return (
        <Link
          href={`/${resource.uniqueId}`}
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
    default:
      return (
        <Chip color="primary" variant="flat">
          咕咕咕
        </Chip>
      )
  }
}
