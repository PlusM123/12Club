import { Card, CardFooter, CardBody, Image } from '@nextui-org/react'
import { Tooltip } from '@nextui-org/tooltip'
import { Download, Eye, Heart, MessageSquare, Puzzle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/utils/formatNumber'

interface CardStatusProps {
  patch?: any
  disableTooltip?: boolean
  className?: string
}

export const CardStatus = ({
  patch,
  disableTooltip = true
}: CardStatusProps) => {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-x-4 justify-start text-sm text-default-500'
      )}
    >
      <Tooltip isDisabled={disableTooltip} content="浏览数" placement="bottom">
        <div className="flex items-center gap-1">
          <Eye className="size-4" />
          <span>{formatNumber(patch?.view || 233)}</span>
        </div>
      </Tooltip>

      <Tooltip isDisabled={disableTooltip} content="下载数" placement="bottom">
        <div className="flex items-center gap-1">
          <Download className="size-4" />
          <span>{formatNumber(patch?.download || 333)}</span>
        </div>
      </Tooltip>

      {/* <Tooltip isDisabled={disableTooltip} content="收藏数" placement="bottom">
        <div className="flex items-center gap-1">
          <Heart className="size-4" />
          <span>{formatNumber(patch?._count.favorite_by || 0)}</span>
        </div>
      </Tooltip>

      <Tooltip isDisabled={disableTooltip} content="评论数" placement="bottom">
        <div className="flex items-center gap-1">
          <MessageSquare className="size-4" />
          <span>{formatNumber(patch?._count.comment || 0)}</span>
        </div>
      </Tooltip> */}
    </div>
  )
}

export const CoverCard = () => {
  return (
    <Card className="pb-4 h-full">
      <CardBody className="overflow-visible w-full">
        <Image
          alt="Card background"
          className="object-cover rounded-xl shadow-lg"
          src="/novel/4.jpg"
          width={2700}
        />
      </CardBody>
      <CardFooter className="py-0 px-4 flex-col gap-2 items-start justify-between h-full">
        <h4 className="font-bold text-sm line-clamp-2">Frontend Radio</h4>
        <CardStatus />
      </CardFooter>
    </Card>
  )
}
