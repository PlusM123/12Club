import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { ParseGetQuery } from '@/utils/parse-query'
import { pageSchema } from '../../../validations/page'
import {
  ALL_SUPPORTED_LANGUAGE,
  ALL_SUPPORTED_TYPE
} from '@/constants/resource'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Data } from '@/types/api/page'
import { imageList } from '@/constants/image'

// 假数据生成函数
function generateDataList(n: number): Data[] {
  const dataList: Data[] = []
  let availableImages = [...imageList] // 复制数组以避免修改原始数组

  for (let i = 0; i < n; i++) {
    const index = Math.floor(Math.random() * availableImages.length)
    const data: Data = {
      view: Math.floor(Math.random() * 1000),
      download: Math.floor(Math.random() * 500),
      _count: {
        favorite_by: Math.floor(Math.random() * 300),
        comment: Math.floor(Math.random() * 200)
      },
      image: availableImages.splice(index, 1)[0], // 选择并移除图片
      title: `Title ${i + 1}`
    }
    dataList.push(data)
  }
  return dataList
}

const getPageData = async (input: z.infer<typeof pageSchema>) => {
  const {
    selectedType = 'all',
    selectedLanguage = 'all',
    sortField,
    sortOrder,
    page,
    limit
  } = input

  const offset = (page - 1) * limit

  const where = {
    ...(selectedType !== 'all' && { type: { has: selectedType } }),
    ...(selectedLanguage !== 'all' && { language: { has: selectedLanguage } })
  }

  const orderBy =
    sortField === 'favorite'
      ? { favorite_by: { _count: sortOrder } }
      : { [sortField]: sortOrder }

  // const [data, total] = await Promise.all([
  //   prisma.patch.findMany({
  //     take: limit,
  //     skip: offset,
  //     orderBy,
  //     where,
  //     select: CardSelectField
  //   }),
  //   prisma.patch.count({
  //     where
  //   })
  // ])

  const total = Math.floor(200)
  const datas: Data[] = generateDataList(24)

  return { datas, total }
}

export const GET = async (req: NextRequest) => {
  const input = ParseGetQuery(req, pageSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }
  if (
    !ALL_SUPPORTED_TYPE.includes(input.selectedType) ||
    !ALL_SUPPORTED_LANGUAGE.includes(input.selectedLanguage)
  ) {
    return NextResponse.json('请选择我们支持的排序类型')
  }

  const response = await getPageData(input)
  return NextResponse.json(response)
}
