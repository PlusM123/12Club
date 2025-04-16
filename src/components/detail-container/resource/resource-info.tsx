'use client'

import { Snippet } from '@heroui/react'
import type { PatchResource } from '@/types/api/patch'

interface Props {
  resource: PatchResource
}

export const ResourceInfo = ({ resource }: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {resource.code && (
          <Snippet
            tooltipProps={{
              content: '点击复制提取码'
            }}
            size="sm"
            symbol="提取码"
            color="primary"
            className="py-0"
          >
            {resource.code}
          </Snippet>
        )}

        {resource.password && (
          <Snippet
            tooltipProps={{
              content: '点击复制解压码'
            }}
            size="sm"
            symbol="解压码"
            color="primary"
            className="py-0"
          >
            {resource.password}
          </Snippet>
        )}
      </div>
    </div>
  )
}
