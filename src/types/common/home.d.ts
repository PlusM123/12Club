export interface HomeCarousel {
  title: string
  href?: string
  imageSrc: string
}

interface Resource {
  name: string
  db_id: string
}

export interface HomeComments {
  id: number
  content: string
  created: string
  user?: User
  resource?: Resource
}
