export interface ResourceComment {
  id: number
  parentId?: number
  resourceId: number
  isLike: boolean
  likeCount: number
  content: string
  created: string
  parentComment?: ResourceComment
  replies?: ResourceComment[]
  userId: number
  user: {
    name: string
    id: number
    avatar: string
  }
}
