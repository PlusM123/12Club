import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/supabase'
import { HomeCarousel, HomeComments } from '@/types/common/home'
import { Data } from '@/types/api/resource'

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
  const supabase = await createClient()
  const { data: carousel } = await supabase
    .from('resource')
    .select('name, image_url, db_id')
    .order('view', { ascending: false })
    .range(0, 9)

  const reorderedData = reorderByCentralPriority(carousel || [])

  const carouselData: HomeCarousel[] = reorderedData.map((item) => ({
    title: item.name,
    imageSrc: item.image_url,
    href: '/anime/' + item.db_id
  }))

  const { data: comments } = await supabase
    .from('resource_comment')
    .select(
      `
      id,
      content,
      created,
      user:user_id (id, name, avatar),
      resource: resource_id(name, db_id)
      `
    )
    .order('created', { ascending: false })
    .range(0, 5)

  const commentsData = (comments as unknown as HomeComments[]) || []

  const { data } = await supabase
    .from('resource')
    .select('name, image_url, db_id, view, download, comment')
    .order('created', { ascending: true })
    .range(0, 11)

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
    updatedResourceData: updatedResourceData as Data[]
  }
}

export const GET = async (req: NextRequest) => {
  const response = await getHomeData()
  return NextResponse.json(response)
}
