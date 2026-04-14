'use client'

import { Card, CardBody, Tab, Tabs } from '@heroui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface UserActivityProps {
  id: number
}

export const UserActivity = ({ id }: UserActivityProps) => {
  const pathname = usePathname()
  const lastSegment = pathname.split('/').filter(Boolean).pop()

  const tabs = [
    { key: 'history', title: '播放历史', href: `/user/${id}/history` },
    { key: 'favorite', title: '收藏夹', href: `/user/${id}/favorite` },
    { key: 'comment', title: '评论', href: `/user/${id}/comment` }
  ]

  return (
    <Card className="w-full">
      <CardBody>
        <Tabs
          aria-label="用户活动"
          fullWidth
          selectedKey={lastSegment}
          color="primary"
          variant="underlined"
        >
          {tabs.map(({ key, title, href }) => (
            <Tab key={key} as={Link} title={title} href={href} />
          ))}
        </Tabs>
      </CardBody>
    </Card>
  )
}
