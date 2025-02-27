'use client'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure
} from "@heroui/react"
import { TreeNode } from '@/lib/mdx/types'
import { ChevronRight } from 'lucide-react'
import { SidebarContent } from './sidebar-content'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Link } from 'next-view-transitions'

interface Props {
  tree: TreeNode
}

export const Sidebar = ({ tree }: Props) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const pathname = usePathname()

  useEffect(() => onClose(), [pathname])

  return (
    <div className="-scroll-nav">
      <aside className="fixed hidden md:block top-32 h-[calc(100dvh-256px)] w-64 bg-background">
        <div className="flex flex-col h-full px-4 overflow-scroll border-r border-default-200 scrollbar-hide bg-background">
          <Link color="foreground" href="/doc" className="my-3 text-xl">
            目录
          </Link>
          {SidebarContent({ tree })}
        </div>
      </aside>

      <div
        className="fixed top-0 left-0 flex items-center h-full cursor-pointer text-default-500 md:hidden"
        onClick={() => onOpen()}
      >
        <ChevronRight size={24} />
      </div>

      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="left"
        size="xs"
      >
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1">目录</DrawerHeader>
          <DrawerBody>{SidebarContent({ tree })}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
