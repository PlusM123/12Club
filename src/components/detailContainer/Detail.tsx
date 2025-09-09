import { cn } from '@/lib/utils'
import { ButtonList } from './ButtonList'
import Image from 'next/image'
import { Cover } from '@/types/common/detail-container'
import { useState } from 'react'

interface DetailCoverProps {
  setSelected: (value: string) => void
  coverData: Cover
  dbId: string
  isFavorite: boolean
}

export const DetailCover = ({ setSelected, coverData, dbId, isFavorite }: DetailCoverProps) => {
  const { title, author, image } = coverData
  const [imageError, setImageError] = useState(false)
  return (
    <div className="relative h-fit shadow-xl w-full rounded-2xl overflow-hidden ">
      <div
        className={cn(
          'absolute h-full w-full -z-10 bg-cover bg-center bg-fixed top-0 left-0 blur-md'
        )}
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="w-full h-fit p-4 grid grid-cols-[auto_1fr] gap-4">
        <div className="imageContainer relative aspect-[5/7] h-full rounded-xl overflow-hidden shadow-lg">
          <Image
            src={imageError ? '/null.gif' : image}
            onError={() => setImageError(true)}
            alt="cover"
            className="object-cover h-full"
            fill
          />
        </div>
        <div className="w-full min-h-44 md:min-h-64 xl:min-h-96 bg-transparent shadow-none rounded-none sm:py-4 xl:py-8 flex flex-col justify-between">
          <div className="bg-background/80 dark:bg-default-100/50 border-none rounded-xl flex-col items-start p-2">
            <h1 className="text-sm xs:text-md md:text-lg lg:text-2xl font-semibold tracking-wide text-sky-500 uppercase">
              {title}
            </h1>
            <p className="text-tiny md:text-md text-gray-500 dark:text-gray-300">
              {author}
            </p>
          </div>

          <div className="hidden w-fit p-2 xl:block bg-background/80 dark:bg-default-100/50 z-10 rounded-xl">
            <ButtonList
              name={title}
              dbId={dbId}
              isFavorite={isFavorite}
              handleClickDownloadNav={() => {
                setSelected('resources')
                window.scrollTo(0, document.body.scrollHeight)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
