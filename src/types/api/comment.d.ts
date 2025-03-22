export interface ResourceComment {
  id: number
  parentId?: number
  content: string
  created: string
  parentComment?: ResourceComment
  replies?: ResourceComment[]
  user?: {
    name: string
    description?: string
    avatar: string
  }
}
