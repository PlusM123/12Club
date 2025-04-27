import { z } from 'zod'
import { adminPaginationSchema } from '@/validations/admin'
import type { AdminUser } from '@/types/api/admin'
import { createClient } from '@/supabase'

export const getUserInfo = async (
  input: z.infer<typeof adminPaginationSchema>
) => {
  const supabase = await createClient()
  const { page, limit, search } = input
  const offset = (page - 1) * limit

  // 构建基础查询
  let query = supabase
    .from('user')
    .select(
      `*,
      resource_patch:resource_patch(count),
      resource:resource(count)`,
      { count: 'exact' }
    )
    .range(offset, offset + limit - 1)
    .order('created', { ascending: false })

  // 添加搜索条件
  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  // 执行查询
  const { data: usersData, count, error } = await query

  if (error) throw error

  // 数据格式转换
  const users: AdminUser[] = (usersData || []).map((user) => ({
    id: user.id,
    name: user.name,
    bio: user.bio,
    avatar: user.avatar,
    role: user.role,
    created: user.created,
    status: user.status,
    _count: {
      resource_patch: user.resource_patch?.[0]?.count || 0,
      resource: user.resource?.[0]?.count || 0
    }
  }))

  return { users, total: count || 0 }
}
