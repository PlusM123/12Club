import { z } from 'zod'
import { adminUpdateUserSchema } from '@/validations/admin'
import { deleteToken } from '@/utils/jwt'
import { createClient } from '@/supabase'

export const updateUser = async (
  input: z.infer<typeof adminUpdateUserSchema>,
  adminUid: number
) => {
  const supabase = await createClient()
  const { uid, ...rest } = input

  const { data: userData, error: userError } = await supabase
    .from('user')
    .select('id,name,bio,role,status')
    .eq('id', uid)
    .single()

  if (!userData) {
    return '未找到该用户'
  }

  const { data: adminData, error: adminError } = await supabase
    .from('user')
    .select('id,name,bio,role,status')
    .eq('id', adminUid)
    .single()

  if (!adminData) {
    return '未找到该管理员'
  }
  if (rest.role >= 3 && adminData.role < 4) {
    return '设置用户为管理员仅限超级管理员可用'
  }

  await deleteToken(uid)

  await supabase
    .from('user')
    .update({
      ...rest,
      updated: new Date()
    })
    .eq('id', uid)

  return {}
}
