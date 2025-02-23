'use client'

import { Moe } from '@/config/moe'
import Link from 'next/link'
import Image from 'next/image'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button
} from '@nextui-org/react'

export const Footer = () => {
  return (
    <footer className="w-full mt-8 text-sm border-t border-divider">
      <div className="px-2 mx-auto sm:px-6 max-w-7xl">
        <div className="flex flex-wrap justify-center gap-4 py-6 md:justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/favicon.ico"
              alt={Moe.titleShort}
              width={30}
              height={30}
            />
            <span>© 2025 {Moe.titleShort}</span>
          </Link>

          <div className="flex space-x-8">
            <Link href="/doc" className="flex items-center">
              使用指南
            </Link>

            <Link
              href="https://github.com/WangshuXC/Graduation-Project"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              GitHub 仓库
            </Link>
          </div>

          <div className="flex space-x-8">
            <Popover placement="top">
              <PopoverTrigger>
                <Button>联系我们</Button>
              </PopoverTrigger>
              <PopoverContent>
                <Image
                  src="/contactUs.png"
                  alt={Moe.titleShort}
                  width={300}
                  height={300}
                  className="rounded-lg m-3"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </footer>
  )
}
