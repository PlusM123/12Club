import { z } from 'zod'
import type { PatchResource } from '@/types/api/patch'
import { createClient } from '@/supabase'

const dbIdSchema = z.object({
  dbId: z.coerce.string().min(1).max(9999999)
})

export const getPatchResource = async (
  input: z.infer<typeof dbIdSchema>,
  uid: number
) => {
  const supabase = await createClient()
  const { dbId } = input

  const { data: currentResource, error: resourceError } = await supabase
    .from('resource')
    .select('id, language, db_id')
    .match({ db_id: dbId })
    .single()

  if (resourceError) {
    return 'Resource not found or error occurred: ' + resourceError?.message
  }

  const { data: patchDataList, error: patchError } = await supabase
    .from('resource_patch')
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
    .match({ resource_id: currentResource.id })

  if (patchError) {
    return 'Failed to insert resource patch: ' + patchError.message
  }

  const resources: PatchResource[] = patchDataList?.map((patchData) => ({
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
  }))

  return resources
}
