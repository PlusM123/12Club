import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { UserInfo } from '@/types/api/user'
import { verifyHeaderCookie } from '@/middleware/_verifyHeaderCookie'
import { ParseGetQuery } from '@/utils/parse-query'
import { createClient } from '@/supabase'

const getProfileSchema = z.object({
  id: z.coerce.number().min(1).max(9999999)
})

export const getUserProfile = async (
  input: z.infer<typeof getProfileSchema>,
  currentUserUid: number
) => {
  const supabase = await createClient()

  const { data } = await supabase
    .from('user')
    .select(
      `
      *
      `
    )
    .eq('id', input.id)
    .single()
  if (!data) {
    return '未找到用户'
  }

  const { count } = await supabase
    .from('resource_comment')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', input.id)

  const user: UserInfo = {
    id: data.id,
    requestUserUid: currentUserUid,
    name: data.name,
    email: data.email,
    avatar: data.avatar,
    bio: data.bio,
    role: data.role,
    status: data.status,
    registerTime: String(data.register_time),
    _count: {
      resource: 0,
      resource_patch: 0,
      resource_comment: count || 0,
      resource_favorite: 0
    }
  }

  return user
}

export async function GET(req: NextRequest) {
  const input = ParseGetQuery(req, getProfileSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }
  const payload = await verifyHeaderCookie(req)

  const user = await getUserProfile(input, payload?.uid ?? 0)
  return NextResponse.json(user)
}
