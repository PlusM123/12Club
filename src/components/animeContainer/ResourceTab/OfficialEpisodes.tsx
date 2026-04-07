'use client'

import { Button, ScrollShadow } from '@heroui/react'
import { Download } from 'lucide-react'

import type { ViewMode } from './types'
import type { PlayListItem } from '@/types/common/detail-container'

interface OfficialEpisodesProps {
  sortedPlayList: PlayListItem[]
  viewMode: ViewMode
  onEpisodeDownload: (item: PlayListItem) => void
}

export const OfficialEpisodes = ({
  sortedPlayList,
  viewMode,
  onEpisodeDownload
}: OfficialEpisodesProps) => {
  return (
    <ScrollShadow className="max-h-80" hideScrollBar>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {sortedPlayList.map((item, index) => {
            const displayText = item.showAccordion || item.accordion.toString()

            return (
              <Button
                key={index}
                variant="flat"
                color="primary"
                className="w-full aspect-square min-w-0 p-0 flex flex-col items-center justify-center text-lg"
                onPress={() => onEpisodeDownload(item)}
              >
                {displayText}
              </Button>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sortedPlayList.map((item, index) => {
            const displayText = item.showAccordion || item.accordion.toString()

            return (
              <Button
                key={index}
                variant="flat"
                color="primary"
                className="w-full h-10 min-w-0 px-4 flex items-center justify-between text-sm"
                endContent={<Download className="size-4" />}
                onPress={() => onEpisodeDownload(item)}
              >
                <span className="font-medium">第{displayText}话</span>
              </Button>
            )
          })}
        </div>
      )}
    </ScrollShadow>
  )
}
