'use client'
import { HomeCarousel, HomeComments } from '@/types/common/home'
import { Data } from '@/types/api/resource'
import { ChevronRight } from 'lucide-react'
import Carousel from '@/components/ui/carousel'
import CommentCard from './comment-card'
import { Button } from '@heroui/react'
import Link from 'next/link'
import { CoverCard } from '../common/cover-card'

interface Props {
  carouselData: HomeCarousel[]
  commentsData: HomeComments[]
  updatedResourceData: Data[]
}

export const HomeContainer = ({
  carouselData,
  commentsData,
  updatedResourceData
}: Props) => {
  return (
    <div
      className={`
        w-screen h-fit overflow-hidden p-3 -mx-3 sm:-mx-6
        flex flex-col gap-3 justify-center items-center
      `}
    >
      <div>
        <Carousel slides={carouselData} />
        <div className="divider 2xl:hidden w-full h-[60px]" />
      </div>

      <div className="container mx-auto my-4 space-y-6 7xl:px-12">
        <section className="space-y-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-bold sm:text-2xl">最新动画</h2>
            <Button
              variant="light"
              as={Link}
              color="primary"
              endContent={<ChevronRight className="size-4" />}
              href="/anime"
            >
              查看更多
            </Button>
          </div>
          <div className="grid gap-4 grid-cols-2 xl:grid-cols-3 4xl:grid-cols-4">
            {updatedResourceData?.map((data) => (
              <CoverCard key={data.dbId} data={data} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-lg font-bold sm:text-2xl">最新评论</h2>
          <div className="grid grid-cols-1 gap-2 lg:gap-6 2xl:grid-cols-2">
            {commentsData?.map((item) => (
              <CommentCard key={item.id} data={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
