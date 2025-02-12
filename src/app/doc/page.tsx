import { getAllPosts } from '@/lib/mdx/getPosts'
import { AboutHeader } from '@/components/doc/Header'
import { AboutCard } from '@/components/doc/Card'
import { MasonryGrid } from '@/components//MasonryGrid'
import { clubMetadata } from './metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = clubMetadata

export default function () {
  const posts = getAllPosts()


  return (
    <div className="w-full px-6 pb-6">
      <AboutHeader />

      <div className="grid gap-4">
        <MasonryGrid columnWidth={256} gap={24}>
          {posts.map((post) => (
            <AboutCard key={post.slug} post={post} />
          ))}
        </MasonryGrid>
      </div>
    </div>
  )
}
