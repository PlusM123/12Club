import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { ParsePostBody } from '@/utils/parse-query'
import { searchSchema } from '../../../validations/search'
import { createClient } from '@/supabase'

const searchData = async (input: z.infer<typeof searchSchema>) => {
  const supabase = await createClient()

  // input: {query: ["胆大党, "dandadan"], page: 1, limit: 10, searchOption: {searchInIntroduction: false, searchInAlias: true}}
  const { query, page, limit, searchOption } = input
  const offset = (page - 1) * limit

  const orConditions = query
    .flatMap((keyword) => {
      const keywordConditions = [
        `name.ilike.%${keyword}%`,
        `author.ilike.%${keyword}%`
      ]

      // 动态添加 introduction 条件
      if (searchOption.searchInIntroduction) {
        keywordConditions.push(`introduction.ilike.%${keyword}%`)
      }

      // if (searchOption.searchInAlias) {
      //   keywordConditions.push(`aliases.ilike.%${keyword}%`)
      // }

      return keywordConditions
    })
    .join(',')

  const { data } = await supabase
    .from('resource')
    .select('name, image_url, db_id, view, download, comment')
    .or(orConditions)
    .range(offset, offset + limit - 1)

  const { count } = await supabase
    .from('resource')
    .select('*', { count: 'exact', head: true })
    .or(orConditions)

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

  // const where = {
  //   ...(selectedType !== 'all' && { type: { has: selectedType } }),
  //   ...(selectedLanguage !== 'all' && { language: { has: selectedLanguage } })
  // }

  // const orderBy =
  //   sortField === 'favorite'
  //     ? { favorite_by: { _count: sortOrder } }
  //     : { [sortField]: sortOrder }

  return { _data, total: count }
}

export const POST = async (req: NextRequest) => {
  const input = await ParsePostBody(req, searchSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }

  const response = await searchData(input)
  return NextResponse.json(response)
}
