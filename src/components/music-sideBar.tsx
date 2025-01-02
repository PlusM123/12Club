'use client';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { FaHeart, FaMusic, FaHouse } from 'react-icons/fa6';

interface SidebarItemProps {
  icon?: IconType;
  label: string;
  active?: boolean;
  href: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, href }) => {
  return (
    <Link
      href={href}
      className={twMerge(
        `
        flex
        flex-row
        h-auto
        items-center
        w-full
        gap-x-2
        text-md
        font-medium
        cursor-pointer
        transition
        text-primary
        py-2
        px-3
        rounded-lg
        `,
        active ? 'bg-white bg-opacity-60 text-onPrimary' : 'hover:text-onPrimary hover:bg-white hover:bg-opacity-30',
      )}
    >
      {Icon && <Icon size={26} />}
      <p className="truncate w-full">{label}</p>
    </Link>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const musicRoute = useMemo(
    () => [
      {
        icon: FaHouse,
        label: '音乐首页',
        active: pathname === '/music',
        href: '/music',
      },
      {
        icon: FaMusic,
        label: '发现',
        active: pathname === '/music/find',
        href: '/music/find',
      },
      {
        icon: FaHeart,
        label: '我喜欢',
        active: pathname === '/music/mylike',
        href: '/music/mylike',
      },
    ],
    [pathname],
  );
  return (
    <aside className="w-64 bg-secondary text-onPrimary p-4">
      <div className="flex flex-col gap-y-4 px-5 py-4">
        {musicRoute.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
