'use client'
import { Card, CardFooter, CardBody, Image } from '@heroui/react'
import { Tooltip } from '@heroui/tooltip'
import { Download, Eye, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/utils/formatNumber'
import type { PageData } from '@/types/api/page'

import { useTransitionRouter } from 'next-view-transitions'
import { upPage } from '@/lib/routerTransition'
import { getRouteByDbId } from '@/utils/router'

interface CardStatusProps {
  data: PageData
  disableTooltip?: boolean
  className?: string
}

export const CardStatus = ({
  data,
  disableTooltip = true
}: CardStatusProps) => {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-2 sm:gap-4 justify-start text-sm text-default-500'
      )}
    >
      <Tooltip isDisabled={disableTooltip} content="浏览数" placement="bottom">
        <div className="flex items-center gap-1">
          <Eye className="size-4" />
          <span>{formatNumber(data?.view || 0)}</span>
        </div>
      </Tooltip>

      <Tooltip isDisabled={disableTooltip} content="下载数" placement="bottom">
        <div className="hidden lg:flex items-center gap-1">
          <Download className="size-4" />
          <span>{formatNumber(data?.download || 0)}</span>
        </div>
      </Tooltip>

      <Tooltip isDisabled={disableTooltip} content="评论数" placement="bottom">
        <div className="flex items-center gap-1">
          <MessageSquare className="size-4" />
          <span>{formatNumber(data?.comment || 0)}</span>
        </div>
      </Tooltip>
    </div>
  )
}

export const CoverCard = ({ data }: { data: PageData }) => {
  const router = useTransitionRouter()
  return (
    <Card
      radius="md"
      isPressable
      disableRipple
      className="pb-4 h-full"
      onPress={() => {
        setTimeout(() => {
          router.push(getRouteByDbId(data.dbId), {
            onTransitionReady: upPage
          })
        }, 100)
      }}
    >
      <CardBody className="overflow-visible w-full">
        <Image
          alt="Card Cover"
          radius="sm"
          className="object-cover"
          src={data.image}
          style={{ aspectRatio: '3/4' }}
          isZoomed
          width={400}
        />
      </CardBody>
      <CardFooter className="py-0 px-4 flex-col gap-2 items-start justify-between h-full">
        <h4 className="font-bold text-sm line-clamp-2 text-left">
          {data.title}
        </h4>
        <CardStatus data={data} />
      </CardFooter>
    </Card>
  )
}
