import { z } from 'zod'
import { createClient } from '@/supabase'

const commentIdSchema = z.object({
  commentId: z.coerce
    .number({ message: '评论 ID 必须为数字' })
    .min(1)
    .max(9999999)
})

const deleteCommentWithReplies = async (commentId: number) => {
  const supabase = await createClient()
  const { data: childComments, error } = await supabase
    .from('resource_comment')
    .select('id')
    .eq('parent_id', commentId)

  if (error) return error

  if (childComments && childComments.length > 0) {
    for (const child of childComments) {
      await deleteCommentWithReplies(child.id)
    }
  }

  const { error: deleteError } = await supabase
    .from('resource_comment')
    .delete()
    .eq('id', commentId)

  if (deleteError) return deleteError

  return {}
}

export const deleteResourceComment = async (
  input: z.infer<typeof commentIdSchema>,
  uid: number,
  userRole: number
) => {
  const supabase = await createClient()
  const { data: comment, error } = await supabase
    .from('resource_comment')
    .select('user_id')
    .match({ id: input?.commentId })
    .single()

  if (error) return error

  if (!comment) {
    return '未找到对应的评论'
  }

  if (comment.user_id !== uid && userRole < 3) {
    return '您没有权限删除该评论'
  }

  const response = await deleteCommentWithReplies(input.commentId)

  return response
}
