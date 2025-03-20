import { z } from 'zod'
import { resourceCreateSchema } from '@/validations/edit'
import { createClient } from '@/supabase'

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

  const newId = resource.id

  if (alias.length) {
    const aliasData = alias.map((name) => ({
      name,
      resource_id: newId
    }))
    await supabase.from('resource_alias').insert(aliasData)
  }

  const bannerArrayBuffer = banner as ArrayBuffer

  return { dbId: resource.db_id }
}
