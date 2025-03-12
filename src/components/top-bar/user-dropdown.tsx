'use client'

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger
} from '@heroui/dropdown'
import { Avatar } from '@heroui/avatar'
import { Button } from '@heroui/button'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@heroui/modal'
import {
  CalendarCheck,
  CircleHelp,
  LogOut,
  Lollipop,
  Settings,
  ArrowLeftRight,
  Sparkles,
  UserRound
} from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { useEffect, useState } from 'react'
import { useRouter } from 'next-nprogress-bar'
import { FetchGet, FetchPost } from '@/utils/fetch'
import toast from 'react-hot-toast'
import { useMounted } from '@/hooks/use-mounted'
import type { UserState } from '@/store/userStore'

export const UserDropdown = () => {
  const router = useRouter()
  const { user, setUser, logout } = useUserStore((state) => state)
  const isMounted = useMounted()
  const [loading, setLoading] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  useEffect(() => {
    if (!isMounted) {
      return
    }
    if (!user.uid) {
      return
    }

    const getUserStatus = async () => {
      const user = await FetchGet<UserState>('/user/status')
      setUser(user)
    }
    getUserStatus()
  }, [isMounted])

  const handleLogOut = async () => {
    setLoading(true)
    await FetchPost<{}>('/user/status/logout')
    setLoading(false)
    logout()
    router.push('/login')
    toast.success('您已经成功登出!')
  }

  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform shrink-0"
            color="primary"
            name={user.name.charAt(0).toUpperCase()}
            size="sm"
            src={user.avatar}
            showFallback
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Profile Actions"
          disabledKeys={user.dailyCheckIn ? ['check'] : []}
        >
          <DropdownItem
            isReadOnly
            key="username"
            textValue="用户名"
            className="cursor-default data-[hover=true]:bg-background"
          >
            <p className="font-semibold">{user.name}</p>
          </DropdownItem>
          <DropdownItem
            key="profile"
            onPress={() => router.push(`/user/${user.uid}`)}
            startContent={<UserRound className="size-4" />}
          >
            用户主页
          </DropdownItem>
          <DropdownItem
            key="settings"
            onPress={() => router.push('/settings/user')}
            startContent={<Settings className="size-4" />}
          >
            信息设置
          </DropdownItem>
          <DropdownItem
            key="help_and_feedback"
            onPress={() => router.push(`/doc/notice/feedback`)}
            startContent={<CircleHelp className="size-4" />}
          >
            帮助与反馈
          </DropdownItem>
          <DropdownItem
            key="logout"
            color="danger"
            startContent={<LogOut className="size-4" />}
            onPress={onOpen}
          >
            退出登录
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                您确定要登出网站吗?
              </ModalHeader>
              <ModalBody>
                <p>登出将会清除您的登录状态, 您可以稍后继续登录</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  关闭
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleLogOut()
                    onClose()
                  }}
                  isLoading={loading}
                  disabled={loading}
                >
                  确定
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
