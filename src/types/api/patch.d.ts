import type { _User } from '../user'

export interface PatchResource {
  id: number
  name: string
  section: string
  dbId: string
  storage: string
  size: string
  language: string[]
  note: string
  hash: string
  content: string
  code: string
  password: string
  likeCount?: number
  isLike?: boolean
  status: number
  userId: number
  resourceId: number
  created: string
  user: _User
}
