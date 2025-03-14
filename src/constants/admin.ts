import type { OverviewData } from '@/types/api/admin'

export const ADMIN_STATS_MAP: Record<keyof OverviewData, string> = {
  newUser: '新注册用户',
  newActiveUser: '新活跃用户',
  newResource: '新发布资源',
  newComment: '新发布评论'
}

export const ADMIN_STATS_SUM_MAP: Record<string, string> = {
  userCount: '用户总数',
  resourceCount: '资源总数',
  commentCount: '评论总数'
}
