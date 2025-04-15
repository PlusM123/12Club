import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { ParseGetQuery } from '@/utils/parse-query'
import { getUserInfoSchema } from '@/validations/user'
import { markdownToText } from '@/utils/markdownToText'
import { verifyHeaderCookie } from '@/middleware/_verifyHeaderCookie'
import type { UserComment } from '@/types/api/user'
import { createClient } from '@/supabase'

export const getUserComment = async (
  input: z.infer<typeof getUserInfoSchema>
) => {
  const supabase = await createClient()

  const { uid, page, limit } = input
  const offset = (page - 1) * limit

  const { data: commentData } = await supabase
    .from('resource_comment')
    .select(
      `
      *,
      resource: resource(*),
      parent: parent_id(
      id,
      user: user_id(id, name)
    )
    `
    )
    .eq('user_id', uid)
    .order('created', { ascending: true })
    .range(offset, offset + limit - 1)

  // 计数查询
  const { count } = await supabase
    .from('resource_comment')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', uid)

  const comments: UserComment[] = (commentData ?? []).map((comment) => ({
    id: comment.id,
    resourceId: comment.resource_id,
    dbId: comment.resource.db_id,
    content: comment.content,
    userId: uid,
    resourceName: comment.resource.name,
    created: comment.created,
    quotedUserUid: comment?.parent?.user.id || null,
    quotedUsername: comment?.parent?.user.name || null
  }))

  console.log(comments)

  return { comments: comments, total: (count as number) || 0 }
}

export const GET = async (req: NextRequest) => {
  const input = ParseGetQuery(req, getUserInfoSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }
  const payload = await verifyHeaderCookie(req)
  if (!payload) {
    return NextResponse.json('用户登陆失效')
  }

  const response = await getUserComment(input)
  return NextResponse.json(response)
}
