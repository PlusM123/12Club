import { NextRequest, NextResponse } from 'next/server'

import { getHomeData } from './get'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const GET = async (_req: NextRequest) => {
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
