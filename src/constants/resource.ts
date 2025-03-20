export const SUPPORTED_TYPE = [
  'battle',
  'romance',
  'action',
  'sci_fi',
  'mystery',
  'comedy',
  'horror',
  'fantasy',
  'school',
  'other'
]

export const SUPPORTED_TYPE_MAP: Record<string, string> = {
  all: '全部类型',
  battle: '热血',
  romance: '恋爱',
  action: '动作',
  sci_fi: '科幻',
  mystery: '悬疑',
  comedy: '喜剧',
  horror: '恐怖',
  fantasy: '奇幻',
  school: '校园',
  other: '其他'
}

export const ALL_SUPPORTED_TYPE = ['all', ...SUPPORTED_TYPE]

export const SUPPORTED_LANGUAGE = ['zh', 'jp', 'en', 'other']
export const ALL_SUPPORTED_LANGUAGE = ['all', ...SUPPORTED_LANGUAGE]
export const SUPPORTED_LANGUAGE_MAP: Record<string, string> = {
  all: '全部语言',
  zh: '中文',
  jp: '日本語',
  en: 'English',
  other: '其它'
}

export const SORT_FIELD_LABEL_MAP: Record<string, string> = {
  created: '创建时间',
  updated: '更新时间',
  view: '播放量',
  download: '下载量'
}
