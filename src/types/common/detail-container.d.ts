export interface Introduction {
  text: string
  created: string // 发布时间
  updated: string // 更新时间
  released?: string // 发售时间，可选
  dbId?: string // DB ID，可选
  alias: string[] // 游戏别名列表
  playList: PlayListItem[]
  isFavorite?: boolean
}

export interface Cover {
  title: string
  author: string
  image: string
}

export interface PlayListItem {
  link: string
  accordion: number
}
