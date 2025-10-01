'use client'

import { useState, memo } from 'react'
import { DetailTabs } from './Tabs'
import { ButtonList } from './ButtonList'
import { PlyrPlayer } from './Plyr'
import { DetailCover } from './Detail'
import { Accordion, AccordionItem, Button } from '@heroui/react'
import { usePathname } from 'next/navigation'
import { TvMinimal, TvMinimalPlay } from 'lucide-react'

import { Introduction, Cover } from '@/types/common/detail-container'
import { ArtPlayer } from './ArtPlayer'
interface DetailContainerProps {
  id: string
  introduce: Introduction
  coverData: Cover
}

const DetailContainerComponent = ({
  id,
  introduce,
  coverData
}: DetailContainerProps) => {
  const pathname = usePathname()

  const [selected, setSelected] = useState('introduction')
  const [accordion, setAccordion] = useState(1)
  const [isOpenOnlinePlay, setIsOpenOnlinePlay] = useState(false)
  const total = introduce?.playList?.length || 0

  return (
    <>
      {coverData && (
        <DetailCover
          setSelected={setSelected}
          coverData={coverData}
          dbId={id.toString()}
          isFavorite={introduce?.isFavorite ?? false}
          view={introduce?._count.view ?? 0}
          download={introduce?._count.download ?? 0}
          comment={introduce?._count.comment ?? 0}
          favorited={introduce?._count.favorited ?? 0}
        />
      )}
      <div className="xl:hidden flex items-end">
        <ButtonList
          name={coverData?.title || ''}
          dbId={id.toString()}
          isFavorite={introduce?.isFavorite ?? false}
          handleClickDownloadNav={() => setSelected('resources')}
        />
      </div>

      {pathname.startsWith('/anime') && introduce?.playList.length > 0 && (
        <Accordion variant="splitted" className="px-0 w-[calc(100%+2rem)] mx-[-1rem]">
          <AccordionItem
            key="onlinePlay"
            aria-label="在线播放"
            onPress={() => {
              window?.umami?.track('在线播放', {
                id
              })
              setIsOpenOnlinePlay(!isOpenOnlinePlay)
            }}
            startContent={isOpenOnlinePlay ? <TvMinimalPlay /> : <TvMinimal />}
            title={<p className=" font-bold text-xl">在线播放</p>}
          >
            <div key={accordion} className="space-y-4 mb-3">
              {accordion > 0 && (
                <div className="rounded-md lg:rounded-2xl overflow-hidden h-fit">
                  {/* <PlyrPlayer
                    src={introduce?.playList[accordion - 1]?.link || ''}
                  /> */}
                  <ArtPlayer
                    src={introduce?.playList[accordion - 1]?.link || ''}
                  />
                </div>
              )}
            </div>
          </AccordionItem>
        </Accordion>
      )}

      {isOpenOnlinePlay ? (
        <div className="flex flex-wrap gap-2 justify-center">
          {introduce?.playList.map((item, index) => (
            <div key={index}>
              <Button
                variant="flat"
                size="sm"
                color="primary"
                className={`${accordion === item.accordion ? 'bg-primary text-white' : ''}`}
                onPress={() => {
                  window?.umami?.track(`在线播放-${item.accordion.toString()}`, {
                    dbId: id
                  })
                  setAccordion(item.accordion)
                }}>
                {item.showAccordion || item.accordion.toString()}
              </Button>
            </div>
          ))}
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

// 使用 memo 优化组件，避免不必要的重新渲染
export const DetailContainer = memo(DetailContainerComponent, (prevProps, nextProps) => {
  // 只有当 id 改变时才重新渲染
  return prevProps.id === nextProps.id &&
    prevProps.introduce === nextProps.introduce &&
    prevProps.coverData === nextProps.coverData
})
