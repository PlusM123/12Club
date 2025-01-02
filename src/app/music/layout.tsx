'use client';
import '../globals.css';
import { useState, useEffect } from 'react';

import Headbar from '@/components/music-headBar';
import Sidebar from '@/components/music-sideBar';
import Footer from '@/components/music-footer';
import PlayList, { PlayItem } from '@/components/music-playList';

import { faker } from '@faker-js/faker/locale/zh_CN';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isPause, setIsPause] = useState(true);
  const [isPLayListShow, setIsShowPlayList] = useState(false);
  const [playMode, setPlayMode] = useState<number>(0);
  const [placeholders, setPlaceholders] = useState<string[]>([]);

  const [playList, setPlayList] = useState<PlayItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const n = 20; // 初始化播放列表的长度
    const initialPlayList = Array.from({ length: n }, () => ({
      songCover: faker.image.url({ width: 300, height: 300 }),
      songName: faker.music.songName(),
      authorName: faker.name.fullName(),
    }));
    setPlayList(initialPlayList);
    setPlaceholders(initialPlayList.slice(0, 5).map((item) => item.songName));
  }, []);

  const changeSong = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % playList.length);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col w-full h-screen relative">
          <Headbar placeholders={placeholders} />
          <main className="flex-1 p-4 bg-primary text-onPrimary pt-12 overflow-y-auto">{children}</main>
        </div>
      </div>
      <Footer
        songCover={playList[currentIndex]?.songCover}
        songName={playList[currentIndex]?.songName}
        authorName={playList[currentIndex]?.authorName}
        isPause={isPause}
        playMode={playMode}
        setIsPause={setIsPause}
        setPlayMode={setPlayMode}
        setIsPlayListShow={setIsShowPlayList}
        changeSong={changeSong}
      />
      <PlayList
        isShow={isPLayListShow}
        setIsPlayListShow={setIsShowPlayList}
        playList={playList}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </div>
  );
}
