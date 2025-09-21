export interface ResourcePlayLink {
  id: number
  accordion: number
  show_accordion: string
  resource_id: number
  user_id: number
  link: string
  created: Date | string
  updated: Date | string
  user?: {
    id: number
    name: string
    avatar: string
  }
}

export interface CreateResourcePlayLinkRequest {
  resourceId: number
  accordion: number
  showAccordion?: string
  link: string
}

export interface UpdateResourcePlayLinkRequest {
  id: number
  accordion: number
  showAccordion?: string
  link: string
}

export interface DeleteResourcePlayLinkRequest {
  id: number
}

export interface ResourcePlayLinkResponse {
  success: boolean
  data?: ResourcePlayLink
  message?: string
}

export interface ResourcePlayLinksResponse {
  success: boolean
  data?: ResourcePlayLink[]
  message?: string
}
