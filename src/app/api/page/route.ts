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

  const filterConditions: Record<string, string> = {}
  if (selectedLanguage !== 'all') filterConditions.language = selectedLanguage
  // if (selectedType !== 'all') filterConditions.type = selectedType

  const { count, error: countError } = await supabase
    .from('resource')
    .select('*', { count: 'exact', head: true })
    .match(filterConditions)

  if (countError) {
    return countError
  }

  const offset = (page - 1) * limit

  const { data } = await supabase
    .from('resource')
    .select('name, image_url, db_id, view, download, comment')
    .match(filterConditions)
    .order(sortField, { ascending: sortOrder === 'asc' })
    .range(offset, offset + limit - 1)

  const _data = data?.map((data) => {
    return {
      title: data.name,
      image: data.image_url,
      dbId: data.db_id,
      view: data.view,
      download: data.download,
      comment: data.comment,
      _count: {
        favorite_by: Math.floor(Math.random() * 300),
        comment: Math.floor(Math.random() * 200)
      }
    }
  })

  return { _data, total: count }
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
