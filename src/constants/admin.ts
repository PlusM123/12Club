import type { OverviewData } from '@/types/api/admin'

export const ADMIN_STATS_MAP: Record<keyof OverviewData, string> = {
  newUser: '新注册用户',
  newActiveUser: '活跃用户',
  newResource: '新发布资源',
  newResourcePatch: '新下载资源',
  newComment: '新发布评论'
}

export const ADMIN_STATS_SUM_MAP: Record<string, string> = {
  userCount: '总用户数',
  resourceCount: '总资源数',
  resourcePatchCount: '总下载资源数',
  commentCount: '总评论数'
}
