export interface ResourceComment {
  id: number
  userId: number
  parentId?: number
  resourceId: number
  content: string
  created: string
  parentComment?: ResourceComment
  replies?: ResourceComment[]
  user: {
    name: string
    id: number
    avatar: string
  }
}
