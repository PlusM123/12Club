import { z } from 'zod'
import { patchResourceUpdateSchema } from '@/validations/patch'
import type { PatchResource } from '@/types/api/patch'
import { createClient } from '@/supabase'

export const updatePatchResource = async (
  input: z.infer<typeof patchResourceUpdateSchema>,
  uid: number,
  userRole: number
) => {
  const supabase = await createClient()
  const { patchId, dbId, ...resourceData } = input

  const { data: currentPatch, error: PatchError } = await supabase
    .from('resource_patch')
    .select('id, user_id')
    .match({ id: patchId })
    .single()

  if (!currentPatch) {
    return '未找到该资源'
  }

  const { data: currentResource, error: resourceError } = await supabase
    .from('resource')
    .select('id, language, db_id')
    .match({ db_id: dbId })
    .single()

  const resourceUserUid = currentPatch.user_id
  if (currentPatch.user_id !== uid && userRole < 3) {
    return '您没有权限更改该资源'
  }

  const { data: patchData, error: patchError } = await supabase
    .from('resource_patch')
    .update({
      ...resourceData
    })
    .match({ id: currentPatch.id, user_id: resourceUserUid })
    .select(
      `
      *,
      user: user_id (
        id,
        name,
        avatar
      )
      `
    )
    .single()

  if (patchError) {
    return 'Failed to insert resource patch: ' + patchError.message
  }

  const resource: PatchResource = {
    id: patchData.id,
    name: patchData.name,
    section: patchData.section,
    dbId: currentResource?.db_id ?? '',
    storage: patchData.storage,
    size: patchData.size,
    language: patchData.language,
    note: patchData.note,
    hash: patchData.hash,
    content: patchData.content,
    code: patchData.code,
    password: patchData.password,
    likeCount: 0,
    isLike: false,
    status: patchData.status,
    userId: patchData.user_id,
    resourceId: patchData.resource_id,
    created: String(patchData.created),
    user: {
      id: patchData.user.id,
      name: patchData.user.name,
      avatar: patchData.user.avatar
    }
  }

  return resource
}
