'use client'

import { useEffect, useState } from 'react'
import { DetailTabs } from './tabs'
import { ButtonList } from './button-list'
import { PlyrPlayer } from './plyr'
import { DetailCover } from './detail'
import { Accordion, AccordionItem, Pagination } from '@heroui/react'
import { usePathname } from 'next/navigation'
import { SelfPagination } from '../common/pagination'
import { useRouter, useSearchParams } from 'next/navigation'
import { TvMinimal, TvMinimalPlay } from 'lucide-react'

import { Introduction, Cover } from '@/types/common/detail-container'

export const DetailContainer = ({
  id,
  introduce,
  coverData
}: {
  id: string
  introduce: Introduction
  coverData: Cover
}) => {
  const pathname = usePathname()

  const [selected, setSelected] = useState('introduction')
  const [accordion, setAccordion] = useState(1)
  const [isOpenOnlinePlay, setIsOpenOnlinePlay] = useState(false)
  const total = introduce?.playList?.length || 0

  return (
    <>
      {coverData && (
        <DetailCover setSelected={setSelected} coverData={coverData} />
      )}
      <div className="xl:hidden flex items-end">
        <ButtonList
          name={coverData?.title || ''}
          handleClickDownloadNav={() => setSelected('resources')}
        />
      </div>

      {pathname.startsWith('/anime') && introduce?.playList.length > 0 && (
        <Accordion variant="splitted" className="px-0">
          <AccordionItem
            key="onlinePlay"
            aria-label="在线播放"
            onPress={() => setIsOpenOnlinePlay(!isOpenOnlinePlay)}
            startContent={isOpenOnlinePlay ? <TvMinimalPlay /> : <TvMinimal />}
            title={<p className=" font-bold text-xl">在线播放</p>}
          >
            <div key={accordion} className="space-y-4 mb-3">
              {accordion > 0 && (
                <div className="rounded-md lg:rounded-2xl overflow-hidden h-fit">
                  <PlyrPlayer
                    src={introduce?.playList[accordion - 1]?.link || ''}
                  />
                </div>
              )}
            </div>
          </AccordionItem>
        </Accordion>
      )}

      {isOpenOnlinePlay ? (
        <div className="w-full flex justify-center">
          {total <= 64 ? (
            <Pagination
              siblings={4}
              total={total}
              initialPage={1}
              page={accordion}
              onChange={(page) => setAccordion(page)}
            />
          ) : (
            <SelfPagination
              total={total}
              page={accordion}
              onPageChange={setAccordion}
            />
          )}
        </div>
      ) : null}

      {introduce && (
        <DetailTabs
          id={id}
          selected={selected}
          setSelected={setSelected}
          introduce={introduce}
        />
      )}
    </>
  )
}
