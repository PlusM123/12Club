import { NextRequest, NextResponse } from 'next/server'

import { getHomeData } from './get'

export const GET = async (req: NextRequest) => {
  try {
    const response = await getHomeData()

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching home data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch home data' },
      { status: 500 }
    )
  }
}
