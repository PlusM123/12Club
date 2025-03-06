import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { ParseGetQuery } from '@/utils/parse-query'
import { pageSchema } from '../../../validations/page'
import {
  ALL_SUPPORTED_LANGUAGE,
  ALL_SUPPORTED_TYPE
} from '@/constants/resource'
import { createClient } from '@/supabase'

const getPageData = async (input: z.infer<typeof pageSchema>) => {
  const supabase = await createClient()

  const {
    selectedType = 'all',
    selectedLanguage = 'all',
    sortField,
    sortOrder,
    page,
    limit
  } = input

  const { count, error: countError } = await supabase
    .from('anime')
    .select('*', { count: 'exact', head: true })

  const offset = (page - 1) * limit

  const { data } = await supabase
    .from('anime')
    .select('title, image_url, db_id')
    .range(offset, offset + limit - 1)
  const datas = data?.map((data) => {
    return {
      title: data.title,
      image: data.image_url,
      dbId: data.db_id,
      view: Math.floor(Math.random() * 1000),
      download: Math.floor(Math.random() * 500),
      _count: {
        favorite_by: Math.floor(Math.random() * 300),
        comment: Math.floor(Math.random() * 200)
      }
    }
  })

  // const where = {
  //   ...(selectedType !== 'all' && { type: { has: selectedType } }),
  //   ...(selectedLanguage !== 'all' && { language: { has: selectedLanguage } })
  // }

  // const orderBy =
  //   sortField === 'favorite'
  //     ? { favorite_by: { _count: sortOrder } }
  //     : { [sortField]: sortOrder }

  // const datas: Data[] = generateDataList(24)

  return { datas, total: count }
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
