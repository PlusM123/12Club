import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { ParseGetQuery } from '@/utils/parse-query'

import { Introduction, Cover } from '@/types/common/detail-container'
import { imageList } from '@/constants/image'

const detailIdSchema = z.object({
  id: z.coerce.number().min(1).max(9999999)
})

const getDetailData = async (input: z.infer<typeof detailIdSchema>) => {
  const introduce: Introduction = {
    text: '敗女的精髓藏於短篇故事中── 數量龐大的特典短篇、活動短篇以及豐橋綜合動植物公園合作短篇等，一共收錄四十篇以上！ 另外還有她們的生日等詳細個人資料……？ 欲熟知本作不可或缺，敗北女角們的幕間短短短篇集！',
    created: '2025-02-15',
    updated: '2023-10-05',
    released: '2022-12-25',
    vndbId: 'v12345',
    alias: ['123123123', '321321321321', '114514']
  }

  const coverData: Cover = {
    title: '敗北女角太多了！ SSS',
    author: '雨森焚火',
    image: imageList[Math.floor(Math.random() * imageList.length)]
  }

  return { introduce, coverData }
}

export const GET = async (req: NextRequest) => {
  const input = ParseGetQuery(req, detailIdSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  const response = await getDetailData(input)
  return NextResponse.json(response)
}
