'use client'
import { Tooltip, Button } from '@heroui/react'
import { ShareButton } from './buttons/ShareButton'
import { Download } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { FavoriteButton } from './buttons/FavoriteButton'

interface Props {
  name: string
  dbId: string
  isFavorite: boolean
  handleClickDownloadNav: () => void
}

export const ButtonList = ({ name, dbId, isFavorite, handleClickDownloadNav }: Props) => {
  const pathName = usePathname()
  return (
    <div className="flex gap-2 ml-auto">
      <Tooltip content="下载资源">
        <Button
          color="primary"
          variant="shadow"
          isIconOnly
          aria-label="下载资源"
          onPress={handleClickDownloadNav}
        >
          <Download className="size-5" />
        </Button>
      </Tooltip>

      <FavoriteButton dbId={dbId} isFavorite={isFavorite} />

      <ShareButton name={name} pathName={pathName} />
    </div>
  )
}
