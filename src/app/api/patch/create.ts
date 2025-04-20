import { z } from 'zod'
import { patchResourceCreateSchema } from '@/validations/patch'
import type { PatchResource } from '@/types/api/patch'
import { createClient } from '@/supabase'

export const createPatchResource = async (
  input: z.infer<typeof patchResourceCreateSchema>,
  uid: number
) => {
  const supabase = await createClient()
  const { dbId, language, content, storage, ...resourceData } = input

  const { data: currentResource, error: resourceError } = await supabase
    .from('resource')
    .select('id, language, db_id')
    .match({ db_id: dbId })
    .single()

  if (resourceError || !currentResource) {
    return 'Resource not found or error occurred: ' + resourceError?.message
  }

  const { data: patchData, error: patchError } = await supabase
    .from('resource_patch')
    .insert({
      storage,
      section: input.section || '',
      name: resourceData.name || '',
      size: resourceData.size || '',
      code: resourceData.code || '',
      password: resourceData.password || '',
      note: resourceData.note || '',
      hash: resourceData.hash || '',
      content,
      language: language || [],
      download: 0,
      status: 0,
      user_id: uid,
      resource_id: currentResource.id
    })
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
