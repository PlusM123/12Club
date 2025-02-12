export interface PostMetadata {
  title: string
  banner: string
  date: string
  description: string
  textCount: number
  slug: string
  path: string
}

export interface TreeNode {
  name: string
  label: string
  path: string
  children?: TreeNode[]
  type: 'file' | 'directory'
}

export interface Frontmatter {
  title: string
  banner: string
  description: string
  date: string
  authorUid: number
  authorName: string
  authorAvatar: string
  authorHomepage: string
  pin: boolean
}

export interface Blog {
  slug: string
  content: string
  frontmatter: Frontmatter
}
