'use client'
import { Tooltip, Button } from '@heroui/react'
import { ShareButton } from './buttons/ShareButton'
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

      <ShareButton name={name} pathName={pathName} />
    </div>
  )
}
