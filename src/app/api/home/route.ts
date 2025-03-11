import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase'

const getDetailData = async () => {
  const supabase = await createClient()
  const { data: anime } = await supabase.from('anime').select()

  return { anime }
}

export const GET = async (req: NextRequest) => {
  const response = await getDetailData()
  return NextResponse.json(response)
}
