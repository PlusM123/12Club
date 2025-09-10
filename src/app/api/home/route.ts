import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../prisma'
import { HomeCarousel, HomeComments } from '@/types/common/home'
import { ResourceData } from '@/types/api/resource'
import { getRouteByDbId } from '@/utils/router'

const reorderByCentralPriority = (sortedArray: any[]) => {
  if (sortedArray.length === 0) return []

  const reordered = []
  const centerIndex = Math.floor((sortedArray.length - 1) / 2)
  reordered[centerIndex] = sortedArray[0]

  let left = centerIndex - 1
  let right = centerIndex + 1
  let isLeftTurn = true

  for (let i = 1; i < sortedArray.length; i++) {
    if (isLeftTurn) {
      reordered[left--] = sortedArray[i]
    } else {
      reordered[right++] = sortedArray[i]
    }
    isLeftTurn = !isLeftTurn
  }

  return reordered.filter((item) => item !== undefined)
}

export const getHomeData = async () => {
  // 获取轮播图数据 - 按浏览量降序排列，取前10条
  const carousel = await prisma.resource.findMany({
    select: {
      name: true,
      image_url: true,
      db_id: true
    },
    orderBy: {
      view: 'desc'
    },
    take: 10
  })

  const reorderedData = reorderByCentralPriority(carousel || [])

  const carouselData: HomeCarousel[] = reorderedData.map((item) => ({
    title: item.name,
    imageSrc: item.image_url,
    href: getRouteByDbId(item.db_id)
  }))

  // 获取评论数据 - 包含用户和资源信息，按创建时间降序排列，取前6条
  const comments = await prisma.resourceComment.findMany({
    select: {
      id: true,
      content: true,
      created: true,
      user: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      },
      resource: {
        select: {
          name: true,
          db_id: true
        }
      }
    },
    orderBy: {
      created: 'desc'
    },
    take: 6
  })

  const commentsData = (comments as unknown as HomeComments[]) || []

  // 获取资源数据 - 按创建时间升序排列，取前12条
  const data = await prisma.resource.findMany({
    select: {
      name: true,
      image_url: true,
      db_id: true,
      view: true,
      download: true,
      comment: true
    },
    orderBy: {
      created: 'asc'
    },
    take: 12
  })

  const updatedResourceData = data?.map((data) => {
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

  return {
    carouselData,
    commentsData,
    updatedResourceData: updatedResourceData as ResourceData[]
  }
}

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
