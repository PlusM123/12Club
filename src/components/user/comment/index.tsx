'use client'

import { useEffect, useState, useTransition } from 'react'

import { getActions } from '@/app/user/[id]/comment/actions'
import { Loading } from '@/components/common/Loading'
import { Null } from '@/components/common/Null'
import { SelfPagination } from '@/components/common/Pagination'

import { UserCommentCard } from './Card'

import type { UserComment as UserCommentType } from '@/types/api/user'

interface Props {
  initComments: UserCommentType[]
  total: number
  uid: number
}

export const UserComment = ({ initComments, total, uid }: Props) => {
  const [comments, setComments] = useState<UserCommentType[]>(initComments)
  const [isPending, startTransition] = useTransition()
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (page === 1) {
      return
    }

    startTransition(async () => {
      const response = await getActions({ uid, page, limit: 20 })
      if (typeof response !== 'string') {
        setComments(response.comments)
      }
    })
  }, [uid, page])

  return (
    <div className="space-y-4">
      {isPending ? (
        <Loading hint="正在获取评论数据..." />
      ) : (
        <>
          {comments.map((com) => (
            <UserCommentCard key={com.id} comment={com} />
          ))}
        </>
      )}

      {!total && !isPending && <Null message="还没有发布过评论哦" />}

      {total > 20 && (
        <div className="flex justify-center">
          <SelfPagination
            total={Math.ceil(total / 20)}
            page={page}
            onPageChange={setPage}
            isLoading={isPending}
          />
        </div>
      )}
    </div>
  )
}
