'use client'

import { useEffect, useState } from 'react'
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle
} from '@nextui-org/navbar'
import Link from 'next/link'
import { TopBarBrand } from './brand'
import { usePathname } from 'next/navigation'
import { NavItemList } from '@/constants/top-bar'
import { MobileMenu } from './mobile-menu'
import { ThemeSwitcher } from './thme-switcher'

export const TopBar = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <Navbar
      maxWidth="xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{ wrapper: 'px-3 sm:px-6' }}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <li className="h-full">
          <NavbarMenuToggle />
        </li>
      </NavbarContent>

      <TopBarBrand />

      <NavbarContent className="hidden gap-3 sm:flex">
        {NavItemList.map((item: any) => (
          <NavbarItem key={item.href} isActive={pathname === item.href}>
            <Link
              className={
                pathname === item.href ? 'text-primary' : 'text-foreground'
              }
              href={item.href}
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <ThemeSwitcher />

      <MobileMenu />
    </Navbar>
  )
}
