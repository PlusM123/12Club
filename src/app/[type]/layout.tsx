import { redirect } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  params: {
    type: string;
  };
}

export default function Layout({
  children,
  params,
}: Readonly<LayoutProps>) {
  if (params.type !== 'comic' && params.type !== 'novel') {
    redirect('/');
  }

  return (
    <div className="w-full h-full flex flex-col sm:px-[5vw] md:px-[10vw] lg:px-[15vw] xl:px-[15vw]">
      {children}
    </div>
  );
}
