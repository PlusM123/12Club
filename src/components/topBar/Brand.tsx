'use client'

import { NavbarBrand } from '@heroui/react'
import { Config } from '@/config/config'
import Image from 'next/image'
import Link from 'next/link'

import { useTransitionRouter } from 'next-view-transitions'
import { upPage } from '@/lib/routerTransition'
import { usePathname } from 'next/navigation'

export const TopBarBrand = () => {
  const router = useTransitionRouter()
  const pathName = usePathname()
  return (
    <NavbarBrand className="hidden mr-4 grow-0 2xl:flex">
      <Link
        className="flex items-center"
        href="/"
        onClick={() => {
          if (pathName === '/') return
          router.push('/', {
            onTransitionReady: upPage
          })
        }}
      >
        <Image
          src="/favicon.ico"
          alt={Config.titleShort}
          width={24}
          height={24}
          priority
        />
        <p className="ml-1 mr-2 hover:text-primary font-bold text-inherit">
          {Config.creator.name}
        </p>
      </Link>
    </NavbarBrand>
  )
}
