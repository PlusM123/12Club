export interface UserInfo {
  id: number
  requestUserUid: number
  name: string
  email: string
  avatar: string
  bio: string
  role: number
  status: number
  registerTime: string
  follower?: number
  following?: number
  isFollow?: boolean
  _count?: {
    patch: number
    patch_resource: number
    patch_comment: number
    patch_favorite: number
  }
}
