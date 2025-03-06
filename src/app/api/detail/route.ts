import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { ParseGetQuery } from '@/utils/parse-query'

import { Introduction, Cover } from '@/types/common/detail-container'
import { createClient } from '@/supabase'

const detailIdSchema = z.object({
  id: z.coerce.string().min(1).max(9999999)
})

const getDetailData = async (input: z.infer<typeof detailIdSchema>) => {
  const supabase = await createClient()
  const { data: detail } = await supabase
    .from('anime')
    .select('*')
    .match({ db_id: input.id })
    .single()
  const introduce: Introduction = {
    text: detail.introduce,
    created: detail.created_date,
    updated: detail.updated_date,
    released: detail.release_date,
    dbId: detail.db_id,
    alias: detail.aliases
  }

  const coverData: Cover = {
    title: detail.title,
    author: detail.author,
    image: detail.image_url
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
