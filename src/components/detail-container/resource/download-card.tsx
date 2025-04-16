'use client'

import { Snippet } from '@heroui/snippet'
import { Chip } from '@heroui/chip'
import { Cloud, Link as LinkIcon, Database } from 'lucide-react'
import { SUPPORTED_RESOURCE_LINK_MAP } from '@/constants/resource'
import { FetchPut } from '@/utils/fetch'
import { ExternalLink } from '@/components/common/external-link'
import type { JSX } from 'react'
import type { PatchResource } from '@/types/api/patch'

const storageIcons: { [key: string]: JSX.Element } = {
  alist: <Cloud className="size-4" />,
  user: <LinkIcon className="size-4" />
}

interface Props {
  resource: PatchResource
}

export const ResourceDownloadCard = ({ resource }: Props) => {
  const handleClickDownload = async () => {
    await FetchPut<{}>('/patch/resource/download', {
      dbId: resource.dbId,
      resourceId: resource.id
    })
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        <Chip
          color="secondary"
          variant="flat"
          startContent={storageIcons[resource.storage]}
        >
          {SUPPORTED_RESOURCE_LINK_MAP[resource.storage as 'alist' | 'user']}
        </Chip>
        <Chip variant="flat" startContent={<Database className="w-4 h-4" />}>
          {resource.size}
        </Chip>
      </div>

      <p className="text-sm text-default-500">点击下面的链接以下载</p>

      {resource.content.split(',').map((link) => (
        <div key={Math.random()} className="space-y-2">
          <ExternalLink
            onPress={handleClickDownload}
            underline="always"
            link={link}
          >
            {link}
          </ExternalLink>
        </div>
      ))}
    </div>
  )
}
