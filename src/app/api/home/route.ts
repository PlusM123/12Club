import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase'
import animeList from './anime_data.json'

const getDetailData = async () => {
  const supabase = await createClient()
  const { data: anime } = await supabase.from('anime').select()

  // // 获取当前日期，格式为 YYYY-MM-DD
  // const currentDate = new Date().toISOString().split('T')[0]

  // // 为每条数据添加 created_date, updated_date, release_date
  // const animeListWithDates = animeList.map((anime) => ({
  //   ...anime,
  //   created_date: currentDate,
  //   updated_date: currentDate,
  //   release_date: new Date(anime.release_date)
  // }))

  // // 插入数据到 Supabase 表
  // const { data: insertedData, error } = await supabase
  //   .from('anime')
  //   .insert(animeListWithDates)
  //   .select()

  // if (error) {
  //   throw error
  // }

  return { anime }
}

export const GET = async (req: NextRequest) => {
  const response = await getDetailData()
  return NextResponse.json(response)
}
