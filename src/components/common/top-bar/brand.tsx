import { NavbarBrand } from "@heroui/navbar"
import { Moe } from '@/config/moe'
import Image from 'next/image'
import Link from 'next/link'

export const TopBarBrand = () => {
  return (
    <NavbarBrand className="hidden mr-4 grow-0 2xl:flex">
      <Link className="flex items-center" href="/">
        <Image
          src="/favicon.ico"
          alt={Moe.titleShort}
          width={24}
          height={24}
          priority
        />
        <p className="ml-4 mr-2 font-bold text-inherit">{Moe.creator.name}</p>
      </Link>
    </NavbarBrand>
  )
}
