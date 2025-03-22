import { z } from 'zod'
import { createClient } from '@/supabase'
import { resourceCommentCreateSchema } from '@/validations/comment'
import { processComments } from '@/utils/processComments'

export const createResourceComment = async (
  input: z.infer<typeof resourceCommentCreateSchema>,
  uid: number
) => {
  const supabase = await createClient()
  const { data: detail, error: detailError } = await supabase
    .from('resource')
    .select('id')
    .match({ db_id: input.id })
    .single()

  if (detailError) return detailError.message

  const { data: newComment, error: commentError } = await supabase
    .from('resource_comment')
    .insert([
      {
        content: input?.content,
        parent_id: input?.parentId,
        user_id: uid,
        resource_id: detail.id
      }
    ])
    .select()
    .single()

  if (commentError) return commentError.message

  const { data: comments, error: commentsError } = await supabase
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

  if (commentsError) return commentsError.message

  const processedComments = processComments(comments)

  return { comment: processedComments, newCommentId: newComment }
}
