import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase'
import animeList from './anime_data.json'

const getDetailData = async () => {
  const supabase = await createClient()

  for (const item of animeList) {
    if (item.introduction && item.author && !item.release_date.includes('每')) {
      const { data: insertedData, error: insetError } = await supabase
        .from('resource')
        .insert([
          {
            name: item.title,
            author: item.author,
            db_id: item.db_id,
            accordion_total: 12,
            image_url: item.image_url,
            introduction: item.introduction,
            released: item.release_date,
            language: 'jp',
            user_id: 15
          }
        ])
        .select('id')
        .single()

      if (insetError) return insetError

      const alias = item.aliases
      if (alias.length) {
        const aliasData = alias.map((name) => ({
          name,
          resource_id: insertedData.id
        }))
        await supabase.from('resource_alias').insert(aliasData)
      }
    }
  }

  const { data, error } = await supabase.from('resource').select()

  if (error) {
    throw error
  }

  return { data }
}

export const GET = async (req: NextRequest) => {
  const response = await getDetailData()
  return NextResponse.json(response)
}
