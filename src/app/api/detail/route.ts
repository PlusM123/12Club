import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { ParseGetQuery } from '@/utils/parse-query'

import { getKv, setKv } from '@/lib/redis'

import { Introduction, Cover } from '@/types/common/detail-container'
import { createClient } from '@/supabase'
import { RESOURCE_CACHE_DURATION } from '@/config/cache'

const detailIdSchema = z.object({
  id: z.coerce.string().min(7).max(7)
})

const CACHE_KEY = 'resource'

const getDetailData = async (input: z.infer<typeof detailIdSchema>) => {
  const cachedResource = await getKv(`${CACHE_KEY}:${input.id}`)
  if (cachedResource) {
    return JSON.parse(cachedResource)
  }
  const supabase = await createClient()
  const { data: detail, error } = await supabase
    .from('resource')
    .select('*')
    .match({ db_id: input.id })
    .single()

  if (!detail) return '资源不存在'
  if (error) return error.message

  const { data: aliasData } = await supabase
    .from('resource_alias')
    .select('name')
    .match({ resource_id: detail.id })

  const introduce: Introduction = {
    text: detail.introduction,
    created: detail.created,
    updated: detail.updated || detail.created,
    released: detail.released,
    dbId: detail.db_id,
    alias: aliasData?.map((item) => item.name) as string[]
  }

  const coverData: Cover = {
    title: detail.name,
    author: detail.author,
    image: detail.image_url
  }

  await setKv(
    `${CACHE_KEY}:${input.id}`,
    JSON.stringify({ introduce, coverData }),
    RESOURCE_CACHE_DURATION
  )

  const { data: updateData, error: updateError } = await supabase
    .from('resource')
    .update({ view: detail.view + 1 })
    .eq('id', detail.id)
    .select()

  if (updateError) return updateError.message

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
