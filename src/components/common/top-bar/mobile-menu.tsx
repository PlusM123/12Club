'use client'

import { NavbarMenu, NavbarMenuItem } from "@heroui/navbar"
import Link from 'next/link'
import Image from 'next/image'
import { Moe } from '@/config/moe'
import { MobileNavItemList } from '@/constants/top-bar'

export const MobileMenu = () => {
  return (
    <NavbarMenu className="space-y-4">
      <NavbarMenuItem>
        <Link className="flex items-center" href="/">
          <Image
            src="/favicon.ico"
            alt={Moe.titleShort}
            width={50}
            height={50}
            priority
          />
          <p className="ml-4 mr-2 text-3xl font-bold">{Moe.creator.name}</p>
        </Link>
      </NavbarMenuItem>

      {MobileNavItemList.map((item: any, index: number) => (
        <NavbarMenuItem key={index}>
          <Link className="w-full font-semibold" href={item.href}>
            {item.name}
          </Link>
        </NavbarMenuItem>
      ))}
    </NavbarMenu>
  )
}
