'use client'

import { Button, CardHeader } from '@heroui/react'
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Grid2X2,
  List,
  Plus
} from 'lucide-react'

import type { ViewMode } from './types'

interface ResourceFilterProps {
  playListCount: number
  viewMode: ViewMode
  isAscending: boolean
  onOpenCreate: () => void
  onToggleViewMode: () => void
  onToggleSortOrder: () => void
}

export const ResourceFilter = ({
  playListCount,
  viewMode,
  isAscending,
  onOpenCreate,
  onToggleViewMode,
  onToggleSortOrder
}: ResourceFilterProps) => {
  return (
    <CardHeader className="px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-medium">下载资源</h3>
        {playListCount > 0 && (
          <span className="text-sm text-default-400">({playListCount})</span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          color="primary"
          variant="light"
          size="sm"
          startContent={<Plus className="size-4" />}
          onPress={onOpenCreate}
        >
          添加
        </Button>
        {playListCount > 0 && (
          <>
            <Button
              variant="light"
              size="sm"
              isIconOnly
              className="text-default-500"
              onPress={onToggleViewMode}
            >
              {viewMode === 'grid' ? (
                <List className="size-5" />
              ) : (
                <Grid2X2 className="size-5" />
              )}
            </Button>

            <Button
              variant="light"
              size="sm"
              isIconOnly
              className="text-default-500"
              onPress={onToggleSortOrder}
            >
              {isAscending ? (
                <ArrowDownWideNarrow className="size-5" />
              ) : (
                <ArrowUpNarrowWide className="size-5" />
              )}
            </Button>
          </>
        )}
      </div>
    </CardHeader>
  )
}
