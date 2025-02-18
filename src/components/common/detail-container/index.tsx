'use client'

import { useState } from 'react'

import Image from 'next/image'
import { Card, CardFooter, CardHeader } from '@nextui-org/card'
import { DetailTabs } from './tabs'
import { ButtonList } from './button-list'

export const DetailContainer = () => {
  const [selected, setSelected] = useState('introduction')
  return (
    <>
      <div className="relative h-44 md:h-64 xl:h-96 bg-[url(/novel/1.jpg)] bg-cover bg-center bg-fixed shadow-xl w-full rounded-2xl overflow-hidden">
        <Card
          className="absolute inset-0 p-4 grid grid-cols-[auto_1fr] gap-4"
          isBlurred
        >
          <div className="imageContainer relative aspect-[5/7] h-full rounded-xl overflow-hidden shadow-lg">
            <Image
              src={'/novel/1.jpg'}
              alt="cover"
              className="object-cover h-full"
              fill
            />
          </div>
          <Card className="w-full bg-transparent shadow-none rounded-none py-4 xl:py-8 felx-col justify-between">
            <CardHeader className="bg-background/80 dark:bg-default-100/50 shadow-md border-nonerounded-lg rounded-lg flex-col items-start">
              <h1 className="text-md sm:text-xl md:text-2xl lg:text-4xl font-semibold tracking-wide text-sky-500 uppercase">
                敗北女角太多了！
              </h1>
              <p className="text-sm md:text-md text-gray-500 dark:text-gray-300">
                雨森焚火
              </p>
            </CardHeader>

            <CardFooter className="hidden xl:block bg-background/80 dark:bg-default-100/50 shadow-md z-10 rounded-lg">
              <ButtonList
                name="b"
                handleClickDownloadNav={() => setSelected('resources')}
              />
            </CardFooter>
          </Card>
        </Card>
      </div>

      <div className="xl:hidden flex items-end">
        <ButtonList
          name="b"
          handleClickDownloadNav={() => setSelected('resources')}
        />
      </div>

      <DetailTabs selected={selected} setSelected={setSelected} />
    </>
  )
}
