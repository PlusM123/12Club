'use client'

import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Input
} from '@heroui/react'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { RenderCell } from './RenderCell'
import { FetchGet } from '@/utils/fetch'
import { Loading } from '@/components/common/loading'
import { useMounted } from '@/hooks/use-mounted'
import { useDebounce } from 'use-debounce'
import { SelfPagination } from '@/components/common/pagination'
import type { AdminResource } from '@/types/api/admin'

const columns = [
  { name: '封面', uid: 'banner' },
  { name: '标题', uid: 'name' },
  { name: '用户', uid: 'user' },
  { name: '时间', uid: 'created' }
]

interface Props {
  initialResources: AdminResource[]
  initialTotal: number
}

export const Resource = ({ initialResources, initialTotal }: Props) => {
  const [resources, setResources] = useState<AdminResource[]>(initialResources)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery] = useDebounce(searchQuery, 500)
  const isMounted = useMounted()

  const [loading, setLoading] = useState(false)
  const fetchData = async () => {
    setLoading(true)

    const { resources, total } = await FetchGet<{
      resources: AdminResource[]
      total: number
    }>('/api/admin/resource', {
      page,
      limit: 30,
      search: debouncedQuery
    })

    setLoading(false)
    setResources(resources)
    setTotal(total)
  }

  useEffect(() => {
    if (!isMounted) {
      return
    }
    fetchData()
  }, [page, debouncedQuery])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">资源管理</h1>
        <Chip color="primary" variant="flat">
          正在开发中...
        </Chip>
      </div>

      <Input
        fullWidth
        isClearable
        placeholder="输入资源名搜索资源"
        startContent={<Search className="text-default-300" size={20} />}
        value={searchQuery}
        onValueChange={handleSearch}
      />

      {loading ? (
        <Loading hint="正在获取资源数据..." />
      ) : (
        <Table
          aria-label="资源管理"
          bottomContent={
            <div className="flex justify-center w-full">
              <SelfPagination
                page={page}
                total={Math.ceil(total / 30)}
                onPageChange={setPage}
                isLoading={loading}
              />
            </div>
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid}>{column.name}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={resources}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>
                    {RenderCell(item, columnKey.toString())}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
