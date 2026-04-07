'use client'

import { useEffect, useState, useTransition } from 'react'

import { getActions } from '@/app/user/[id]/resource/actions'
import { Loading } from '@/components/common/Loading'
import { Null } from '@/components/common/Null'
import { SelfPagination } from '@/components/common/Pagination'

import { UserResourceCard } from './Card'

import type { UserResource as UserResourceType } from '@/types/api/user'

interface Props {
  resources: UserResourceType[]
  total: number
  uid: number
}

export const UserResource = ({ resources, total, uid }: Props) => {
  const [patches, setPatches] = useState<UserResourceType[]>(resources)
  const [isPending, startTransition] = useTransition()
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (page === 1) {
      return
    }

    startTransition(async () => {
      const response = await getActions({ uid, page, limit: 20 })
      if (typeof response !== 'string') {
        setPatches(response.resources)
      }
    })
  }, [uid, page])

  return (
    <div className="space-y-4">
      {isPending ? (
        <Loading hint="正在获取资源数据..." />
      ) : (
        <>
          {patches.map((resource) => (
            <UserResourceCard key={resource.id} resource={resource} />
          ))}
        </>
      )}

      {!total && <Null message="还没有发布过资源哦" />}

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
