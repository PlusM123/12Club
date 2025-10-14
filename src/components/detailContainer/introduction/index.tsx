'use client'
import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@heroui/react'
import { Info } from './Info'
import type { Introduction } from '@/types/common/detail-container'
import { usePathname } from 'next/navigation'

interface Props {
  intro: Introduction
  tagList?: string[]
}

const typeMap = {
  comic: '漫画',
  novel: '小说',
  animate: '动画'
}

export const IntroductionTab = ({ intro, tagList }: Props) => {
  const pathname = usePathname()
  const [typeLabel, setTypeLabel] = useState('')
  useEffect(() => {
    for (const key in typeMap) {
      if (pathname.startsWith(`/${key}`)) {
        const validKey = key as keyof typeof typeMap
        setTypeLabel(typeMap[validKey])
        break
      }
    }
  }, [pathname])

  return (
    <Card className="p-1 lg:p-8">
      <CardBody className="p-4 space-y-6">
        <div className="max-w-none">
          <h2 className="text-2xl pb-4 font-medium">{typeLabel}简介</h2>
          <div className="whitespace-pre-line">
            {intro.text.replace(/<br\s?\/?>/gi, '\n\n')}
          </div>
        </div>

        <Info intro={intro} type={typeLabel} />
      </CardBody>
    </Card>
  )
}
