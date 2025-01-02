import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaIndent, FaSignal } from 'react-icons/fa6';
import { twMerge } from 'tailwind-merge';

export interface PlayListProps {
  isShow: boolean;
  playList?: PlayItem[];
  setIsPlayListShow: (isPlayListShow: boolean) => void;
  currentIndex: number;
  setCurrentIndex: (currentIndex: number) => void;
}

export interface PlayItem {
  songCover: string;
  songName: string;
  authorName: string;
}

const PlayList: React.FC<PlayListProps> = ({ isShow, playList, setIsPlayListShow, currentIndex, setCurrentIndex }) => {
  const playListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (playListRef.current && !playListRef.current.contains(event.target as Node)) {
        setIsPlayListShow(false);
      }
    };

    if (isShow) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShow, setIsPlayListShow]);

  return (
    <motion.div
      ref={playListRef}
      className="fixed top-0 right-0 w-1/3 h-screen bg-secondary text-primary shadow-lg flex flex-col p-4 z-50"
      initial={{ x: '100%' }}
      animate={{ x: isShow ? '0%' : '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 40 }}
    >
      <button onClick={() => setIsPlayListShow(false)}>
        <FaIndent className="h-[24px] w-[24px] mt-4" />
      </button>
      <h2 className="text-2xl font-bold my-8">播放列表</h2>
      {playList ? (
        <div className="flex flex-col space-y-4 pr-2 overflow-auto">
          {playList.map((item, index) => (
            <div
              key={index}
              className={twMerge(
                `
                flex items-center space-x-4 p-2 rounded-lg font-semibold
                `,
                index === currentIndex
                  ? 'bg-white bg-opacity-60 text-onPrimary'
                  : 'hover:bg-opacity-30 hover:bg-white hover:text-onPrimary',
              )}
              onClick={() => {
                if (index !== currentIndex) setCurrentIndex(index);
              }}
            >
              <div className="relative">
                <Image
                  src={item.songCover}
                  loading="eager"
                  width={500}
                  height={500}
                  className="w-16 h-16 rounded-md"
                  alt={item.songName}
                />
                <div
                  className={twMerge(
                    'absolute inset-0 flex items-center justify-center rounded-md',
                    index === currentIndex && 'bg-black bg-opacity-50 ',
                  )}
                >
                  {index === currentIndex && (
                    <motion.div
                      className="flex items-center justify-center overflow-hidden"
                      animate={{ opacity: [0, 100, 0] }}
                      transition={{
                        duration: 1,
                        ease: 'linear',
                        repeat: Infinity,
                        repeatType: 'loop',
                      }}
                    >
                      <FaSignal className="text-white h-10 w-10" />
                    </motion.div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg">{item.songName}</h3>
                <p className="text-sm opacity-40">{item.authorName}</p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </motion.div>
  );
};

export default PlayList;
