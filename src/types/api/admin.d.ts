export interface OverviewData {
  newUser: number
  newActiveUser: number
  newResource: number
  newComment: number
}

export interface AdminUser {
  id: number
  name: string
  bio: string
  avatar: string
  role: number
  status: number
  created: Date | string
  _count: {
    resource: number
    resource_patch: number
  }
}
