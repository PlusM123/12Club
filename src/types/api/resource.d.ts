export interface ResourceData {
  view: number
  download: number
  comment: number
  _count: {
    favorite_by: number
    comment: number
  }
  image: string
  title: string
  dbId: string
  status: number
}

export interface FavoriteToggleResponse {
  added: boolean
}
