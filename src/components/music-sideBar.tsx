'use client';
import Link from 'next/link';
import { IconType } from 'react-icons';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

import { FaHeart, FaMusic, FaHouse } from 'react-icons/fa6';
interface SidebarProps {
  setIsFullScreen: (isFullScreen: boolean) => void;
}
interface SidebarItemProps {
  icon?: IconType;
  label: string;
  active?: boolean;
  href: string;
  setIsFullScreen: (isFullScreen: boolean) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, href, setIsFullScreen }) => {
  return (
    <Link
      href={href}
      onClick={() => setIsFullScreen(false)}
      className={twMerge(
        `
        flex gap-x-2 flex-row h-auto items-center
        w-full rounded-lg py-2 px-3 cursor-pointer transition
        text-md font-medium text-primary
        `,
        active ? 'bg-primary text-onPrimary' : 'hover:text-onPrimary',
      )}
    >
      {Icon && <Icon size={26} />}
      <p className="truncate w-full">{label}</p>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ setIsFullScreen }) => {
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

  // 预加载两个路由
  const router = useRouter()
  useEffect(() => {
    router.prefetch('/music/like')
    router.prefetch('/music/find')
  }, [router])

  return (
    <aside className="w-64 bg-secondary text-onPrimary p-4">
      <div className="flex flex-col gap-y-4 px-5 py-4">
        {musicRoute.map((item) => (
          <SidebarItem key={item.label} {...item} setIsFullScreen={setIsFullScreen} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
