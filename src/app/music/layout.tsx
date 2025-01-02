'use client';
import '../globals.css';
import { useState, useEffect } from 'react';

import Sidebar from '@/components/music-sideBar';
import Footer from '@/components/music-footer';

import { faker } from '@faker-js/faker';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isPause, setIsPause] = useState(true);
  const [playMode, setPlayMode] = useState(0);

  const [songCover, setSongCover] = useState('');
  const [songName, setSongName] = useState('');
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    setSongCover(faker.image.url({ width: 300, height: 300 }));
    setSongName(faker.music.songName());
    setAuthorName(faker.music.artist());
  }, []);

  const changeSong = () => {
    setSongCover(faker.image.url({ width: 300, height: 300 }));
    setSongName(faker.music.songName());
    setAuthorName(faker.music.artist());
  };
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-col w-full">
          <div className="bg-primary text-onPrimary w-full h-10">search</div>
          <main className="flex-1 p-4 bg-primary text-onPrimary">{children}</main>
        </div>
      </div>
      <Footer
        songCover={songCover}
        songName={songName}
        authorName={authorName}
        isPause={isPause}
        playMode={playMode}
        setIsPause={setIsPause}
        setPlayMode={setPlayMode}
        changeSong={changeSong}
      />
    </div>
  );
}
