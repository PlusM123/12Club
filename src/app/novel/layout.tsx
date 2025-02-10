export default function NovelLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="w-full h-full flex flex-col px-[20vw]">
        {children}
      </div>
    );
  }