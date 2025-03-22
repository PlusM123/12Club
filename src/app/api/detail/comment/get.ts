import { z } from 'zod'
import { createClient } from '@/supabase'
import { processComments } from '@/utils/processComments'

const detailIdSchema = z.object({
  id: z.coerce.string().min(7).max(7)
})

export const getResourceComment = async (
  input?: z.infer<typeof detailIdSchema>,
  uid?: number
) => {
  const supabase = await createClient()
  const { data: detail, error: detailError } = await supabase
    .from('resource')
    .select('id')
    .match({ db_id: input ? input.id : 'a312010' })
    .single()

  if (detailError) return detailError.message

  const { data: comments, error: commentError } = await supabase
    .from('resource_comment')
    .select(
      `
    id,
    parent_id,
    content,
    created,
    user:user_id (name, avatar)
    `
    )
    .match({ resource_id: detail.id })

  if (commentError) return commentError.message

  const processedComments = processComments(comments)

  return { comment: processedComments }
}
