'use client'

import { useEffect, useState } from 'react'
import { DetailTabs } from './tabs'
import { ButtonList } from './button-list'
import { PlyrPlayer } from './plyr'
import { DetailCover } from './detail'
import { Accordion, AccordionItem, Pagination } from '@heroui/react'
import { usePathname } from 'next/navigation'
import { SelfPagination } from './pagination'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tv } from 'lucide-react'

export const DetailContainer = () => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    return params.toString()
  }
  const [selected, setSelected] = useState('introduction')
  const [accordion, setAccordion] = useState(0)
  const total = 24
  useEffect(() => {
    if (accordion > 0) {
      router.push(`?${createQueryString('accordion', String(accordion))}`, {
        scroll: false
      })
    }
  }, [accordion])
  return (
    <>
      <DetailCover setSelected={setSelected} />
      <div className="xl:hidden flex items-end">
        <ButtonList
          name="b"
          handleClickDownloadNav={() => setSelected('resources')}
        />
      </div>

      {pathname.startsWith('/animate') && (
        <Accordion variant="splitted" className="px-0">
          <AccordionItem
            key="1"
            aria-label="在线播放"
            startContent={<Tv />}
            title={<p className=" font-bold text-xl">在线播放</p>}
          >
            <div className="space-y-4 mb-3">
              {accordion > 0 && (
                <div className="rounded-md lg:rounded-2xl overflow-hidden h-fit">
                  <PlyrPlayer src="https://img.touchgalstatic.org/2023/06/52c4e244dd20231121045637.mp4" />
                </div>
              )}
              <div className="w-full flex justify-center">
                {total <= 64 ? (
                  <Pagination
                    siblings={4}
                    total={total}
                    initialPage={0}
                    page={accordion}
                    onChange={(page) => setAccordion(page)}
                    className="mx-auto"
                  />
                ) : (
                  <SelfPagination
                    total={total}
                    page={accordion}
                    onPageChange={setAccordion}
                  />
                )}
              </div>
            </div>
          </AccordionItem>
        </Accordion>
      )}

      <DetailTabs selected={selected} setSelected={setSelected} />
    </>
  )
}
