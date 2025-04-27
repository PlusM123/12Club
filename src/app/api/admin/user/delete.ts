import { z } from 'zod'
import { deleteResource } from '../../patch/delete'
import { createClient } from '@/supabase'

const userIdSchema = z.object({
  uid: z.coerce.number({ message: '用户 ID 必须为数字' }).min(1).max(9999999)
})

export const deleteUser = async (
  input: z.infer<typeof userIdSchema>,
  uid: number
) => {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase
    .from('user')
    .select('id,name,bio,role,status')
    .eq('id', input.uid)
    .single()

  if (!userData) {
    return '未找到该用户'
  }

  if (input.uid === uid) {
    return '请勿删除自己'
  }

  const { data: adminData, error: adminError } = await supabase
    .from('user')
    .select('id,name,bio,role,status')
    .eq('id', uid)
    .single()

  if (!adminData) {
    return '未找到该管理员'
  }

  if (adminData.role < 3) {
    return '删除用户仅限管理员可用'
  }

  const { data: resourceData, error: resourceError } = await supabase
    .from('resource_patch')
    .select('id')
    .eq('user_id', input.uid)

  if (resourceData && resourceData.length > 0) {
    for (const resource of resourceData) {
      const deleteResourceResult = await deleteResource(
        { patchId: resource.id },
        uid,
        adminData.role
      )
      if (deleteResourceResult) {
        return deleteResourceResult
      }
    }
  }

  const { error } = await supabase
    .from('user')
    .delete()
    .match({ id: input.uid })

  return {}
}
