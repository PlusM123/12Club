import { z } from 'zod'
import { createClient } from '@/supabase'

const patchIdSchema = z.object({
  patchId: z.coerce
    .number({ message: '资源 ID 必须为数字' })
    .min(1)
    .max(9999999)
})

export const deleteResource = async (
  input: z.infer<typeof patchIdSchema>,
  uid: number,
  userRole: number
) => {
  const supabase = await createClient()

  const { data: currentPatch, error: PatchError } = await supabase
    .from('resource_patch')
    .select('id, user_id')
    .match({ id: input.patchId })
    .single()

  if (!currentPatch) {
    return '未找到该资源'
  }

  const resourceUserUid = currentPatch.user_id
  if (currentPatch.user_id !== uid && userRole < 3) {
    return '您没有权限删除该资源'
  }

  const { error } = await supabase
    .from('resource_patch')
    .delete()
    .match({ id: currentPatch.id, user_id: resourceUserUid })

  return {}
}
