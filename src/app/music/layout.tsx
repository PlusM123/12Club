'use client'
import { useState, useEffect } from 'react'

import Headbar from '@/components/music/MusicHeadBar'
import Sidebar from '@/components/music/MusicSideBar'
import Footer from '@/components/music/MusicFooter'
import PlayList, { PlayItem } from '@/components/music/MusicPlayList'
import FullScreen from '@/components/music/MusicFullScreen'

import { faker } from '@faker-js/faker/locale/zh_CN'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isPause, setIsPause] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isPLayListShow, setIsShowPlayList] = useState(false)
  const [playMode, setPlayMode] = useState<number>(0)
  const [placeholders, setPlaceholders] = useState<string[]>([])

  const [playList, setPlayList] = useState<PlayItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const n = 20 // 初始化播放列表的长度
    const initialPlayList = Array.from({ length: n }, () => ({
      songCover: faker.image.url({ width: 300, height: 300 }),
      songName: faker.music.songName(),
      authorName: faker.name.fullName()
    }))
    setPlayList(initialPlayList)
    setPlaceholders(initialPlayList.slice(0, 5).map((item) => item.songName))
  }, [])

  const changeSong = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % playList.length)
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar setIsFullScreen={setIsFullScreen} />
        <div className="flex flex-col w-full relative">
          <Headbar placeholders={placeholders} />
          <main className="flex-1 p-4 text-foreground pt-12 overflow-y-auto">
            {children}
          </main>
          <FullScreen
            isFullScreen={isFullScreen}
            songCover={playList[currentIndex]?.songCover}
            songName={playList[currentIndex]?.songName}
            authorName={playList[currentIndex]?.authorName}
          />
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
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
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
  )
}
