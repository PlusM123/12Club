'use client'
import { Tooltip, Button } from '@nextui-org/react'
import { ShareButton } from './buttons/share-button'
import { Download } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface Props {
  name: string
  handleClickDownloadNav: () => void
}

export const ButtonList = ({ name, handleClickDownloadNav }: Props) => {
  const pathName = usePathname()
  return (
    <div className="flex gap-2 ml-auto">
      <Tooltip content="下载游戏">
        <Button
          color="primary"
          variant="shadow"
          isIconOnly
          aria-label="下载游戏"
          onPress={handleClickDownloadNav}
        >
          <Download className="size-5" />
        </Button>
      </Tooltip>

      <ShareButton name={name} pathName={pathName} />
    </div>
  )
}
