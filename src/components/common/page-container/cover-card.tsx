'use client'
import { Card, CardFooter, CardBody, Image } from '@heroui/react'
import { Tooltip } from '@heroui/tooltip'
import { Download, Eye, Heart, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/utils/formatNumber'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Data } from '@/types/api/page'

interface CardStatusProps {
  data: Data
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
        'flex flex-wrap gap-4 justify-start text-sm text-default-500'
      )}
    >
      <Tooltip isDisabled={disableTooltip} content="浏览数" placement="bottom">
        <div className="flex items-center gap-1">
          <Eye className="size-4" />
          <span>{formatNumber(data?.view || 0)}</span>
        </div>
      </Tooltip>

      <Tooltip isDisabled={disableTooltip} content="下载数" placement="bottom">
        <div className="flex items-center gap-1">
          <Download className="size-4" />
          <span>{formatNumber(data?.download || 0)}</span>
        </div>
      </Tooltip>

      {/* <Tooltip isDisabled={disableTooltip} content="收藏数" placement="bottom">
        <div className="flex items-center gap-1">
          <Heart className="size-4" />
          <span>{formatNumber(data?._count.favorite_by || 0)}</span>
        </div>
      </Tooltip>

      <Tooltip isDisabled={disableTooltip} content="评论数" placement="bottom">
        <div className="flex items-center gap-1">
          <MessageSquare className="size-4" />
          <span>{formatNumber(data?._count.comment || 0)}</span>
        </div>
      </Tooltip> */}
    </div>
  )
}

export const CoverCard = ({ data }: { data: Data }) => {
  const pathName = usePathname()
  return (
    <Card
      radius="md"
      isPressable
      className="pb-4 h-full"
      as={Link}
      href={pathName + '/test'}
    >
      <CardBody className="overflow-visible w-full">
        <Image
          alt="Card Coverd"
          radius="sm"
          className="object-cover"
          src={data.image}
          isZoomed
          width={400}
        />
      </CardBody>
      <CardFooter className="py-0 px-4 flex-col gap-2 items-start justify-between h-full">
        <h4 className="font-bold text-sm line-clamp-2">{data.title}</h4>
        <CardStatus data={data} />
      </CardFooter>
    </Card>
  )
}
