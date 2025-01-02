import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  FaBackwardStep,
  FaForwardStep,
  FaPause,
  FaPlay,
  FaRepeat,
  FaRotate,
  FaShuffle,
  FaUpRightAndDownLeftFromCenter,
  FaAlignLeft,
} from 'react-icons/fa6';

import VolumeControl from './music-volumeControl';

interface FooterProps {
  songCover: string;
  songName: string;
  authorName: string;
  isPause: boolean;
  playMode: number;
  setIsPause: (isPause: boolean) => void;
  setPlayMode: (playMode: number) => void;
  setIsPlayListShow: (isPlayListShow: boolean) => void;
  changeSong: () => void;
}

const PlayModeIcon: React.FC<{ playMode: number; className: string }> = ({ playMode, className }) => {
  switch (playMode) {
    case 0:
      return <FaRepeat className={className} />;
    case 1:
      return <FaRotate className={className} />;
    case 2:
      return <FaShuffle className={className} />;
    default:
      return null;
  }
};

const Footer: React.FC<FooterProps> = ({
  songCover,
  songName,
  authorName,
  isPause,
  playMode,
  setIsPause,
  setPlayMode,
  setIsPlayListShow,
  changeSong,
}) => {
  return (
    <footer className="bg-onPrimary text-secondary h-20 p-4 flex justify-between items-center relative">
      <div className="flex items-center">
        <motion.div className="relative cursor-pointer mr-4" whileHover={{ scale: 1.1 }}>
          <Image
            src={songCover}
            loading="eager"
            width={500}
            height={500}
            className="w-12 h-12 rounded-md"
            alt="Song Cover"
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FaUpRightAndDownLeftFromCenter className="text-white h-4 w-4" />
          </motion.div>
        </motion.div>
        <div className="w-64">
          <p className="truncate text-lg">{songName}</p>
          <p className="truncate text-sm">{authorName}</p>
        </div>
      </div>
      <div className="flex items-center absolute left-1/2 -translate-x-1/2 ">
        <button className="mx-2" onClick={changeSong}>
          <FaBackwardStep className="h-[24px] w-[24px]" />
        </button>
        <motion.button
          className="h-14 px-10 mx-6 rounded-full hover:bg-secondary hover:text-primary"
          onClick={() => setIsPause(!isPause)}
          whileHover={{ scale: 1.05, backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary)' }}
          transition={{
            scale: { type: 'spring', stiffness: 300 },
            backgroundColor: { duration: 0.3 },
            color: { duration: 0.3 },
          }}
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-onPrimary)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {isPause ? <FaPause className="h-[36px] w-[36px]" /> : <FaPlay className="h-[36px] w-[36px]" />}
          </motion.div>
        </motion.button>
        <button className="mx-2" onClick={changeSong}>
          <FaForwardStep className="h-[24px] w-[24px] " />
        </button>
      </div>
      <div className="flex flex-row justify-center items-center px-4 gap-x-6">
        <VolumeControl />
        <button onClick={() => setIsPlayListShow(true)}>
          <FaAlignLeft className="h-[24px] w-[24px]" />
        </button>

        <button onClick={() => (playMode === 2 ? setPlayMode(0) : setPlayMode(playMode + 1))}>
          <PlayModeIcon className="h-[24px] w-[24px]" playMode={playMode} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
