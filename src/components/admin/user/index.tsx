'use client'

import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Input,
  getKeyValue
} from '@heroui/react'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { RenderCell } from './render-cell'
import { FetchGet } from '@/utils/fetch'
import { Loading } from '@/components/common/loading'
import { useMounted } from '@/hooks/use-mounted'
import { useDebounce } from 'use-debounce'
import { SelfPagination } from '@/components/common/pagination'
import type { AdminUser } from '@/types/api/admin'

const columns = [
  { name: '用户', uid: 'user' },
  { name: '角色', uid: 'role' },
  { name: '状态', uid: 'status' },
  { name: '操作', uid: 'actions' }
]

interface Props {
  initialUsers: AdminUser[]
  initialTotal: number
}

export const User = ({ initialUsers, initialTotal }: Props) => {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery] = useDebounce(searchQuery, 500)
  const isMounted = useMounted()

  const [loading, setLoading] = useState(false)
  const fetchData = async () => {
    setLoading(true)

    const { users, total } = await FetchGet<{
      users: AdminUser[]
      total: number
    }>('/admin/user', {
      page,
      limit: 30,
      search: debouncedQuery
    })

    setLoading(false)
    setUsers(users)
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

  const rows = [
    {
      key: '1',
      name: 'Tony Reichert',
      role: 'CEO',
      status: 'Active'
    },
    {
      key: '2',
      name: 'Zoey Lang',
      role: 'Technical Lead',
      status: 'Paused'
    },
    {
      key: '3',
      name: 'Jane Fisher',
      role: 'Senior Developer',
      status: 'Active'
    },
    {
      key: '4',
      name: 'William Howard',
      role: 'Community Manager',
      status: 'Vacation'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">用户管理</h1>
      </div>

      <Input
        fullWidth
        isClearable
        placeholder="搜索用户名..."
        startContent={<Search className="text-default-300" size={20} />}
        value={searchQuery}
        onValueChange={handleSearch}
      />

      {loading ? (
        <Loading hint="正在获取消息数据..." />
      ) : (
        <Table
          aria-label="用户管理"
          bottomContent={
            <div className="flex justify-center w-full">
              <SelfPagination
                page={page}
                total={Math.ceil(total / 30)}
                onPageChange={(newPage) => setPage(newPage)}
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
          <TableBody items={users}>
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
