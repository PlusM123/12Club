import type { ResourceComment } from './comment'

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

export interface AdminComment {
  id: number
  userId: number
  resourceId: number
  content: string
  created: Date
  user: {
    id: number
    name: string
    avatar: string
  }
  resource: {
    name: string
    dbId: string
  }
  likeCount: number
  parentId?: number
}

export interface AdminResource {
  id: number
  uniqueId: string
  name: string
  banner: string
  created: Date | string
  user: {
    id: number
    name: string
    avatar: string
  }
}