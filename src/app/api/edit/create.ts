import { z } from 'zod'
import { resourceCreateSchema } from '@/validations/edit'
import { createClient } from '@/supabase'
import { uploadResourceImage } from './_upload'

export const createResource = async (
  input: Omit<z.infer<typeof resourceCreateSchema>, 'alias'> & {
    alias: string[]
  },
  uid: number
) => {
  const supabase = await createClient()
  const {
    name,
    author,
    accordionTotal,
    language,
    dbId,
    alias,
    banner,
    introduction,
    released
  } = input

  const { data: resource, error: resourceError } = await supabase
    .from('resource')
    .insert([
      {
        name,
        author,
        language,
        accordion_total: Number(accordionTotal),
        db_id: dbId,
        introduction,
        released,
        user_id: uid
      }
    ])
    .select('id, db_id')
    .single()

  if (resourceError) return resourceError

  if (alias.length) {
    const aliasData = alias.map((name) => ({
      name,
      resource_id: resource.id
    }))
    await supabase.from('resource_alias').insert(aliasData)
  }

  const bannerArrayBuffer = await banner.arrayBuffer()
  const uploadResult = await uploadResourceImage(
    bannerArrayBuffer,
    resource.db_id
  )
  if (typeof uploadResult === 'string') {
    return uploadResult
  }

  const imageLink = `${process.env.IMAGE_BED_URL}/resource/${resource.db_id}/banner.avif`
  const { error } = await supabase
    .from('resource')
    .update({ image_url: imageLink })
    .eq('db_id', resource.db_id)
  if (error) return error

  return { dbId: resource.db_id }
}
