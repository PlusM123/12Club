import React, { useState, useRef } from 'react';
import { FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import './css/music-volumeControl.css';

const VolumeControl = () => {
  const [volume, setVolume] = useState(50);
  const [beforeVolume, setbeforeVolume] = useState(50);
  const [showVolumeBar, setShowVolumeBar] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
    // 这里可以添加代码来实际调整页面的音量
  };

  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setShowVolumeBar(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setShowVolumeBar(false);
    }, 200);
  };

  return (
    <div className="relative inline-block flex">
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex"
        onClick={() => {
          if (volume) {
            setbeforeVolume(volume);
            setVolume(0);
          } else {
            setVolume(beforeVolume);
          }
        }}
      >
        {volume ? (
          <FaVolumeHigh className="h-[24px] w-[24px] scale-[1.2] relative" />
        ) : (
          <FaVolumeXmark className="h-[24px] w-[24px] scale-[1.1] relative" />
        )}
      </button>
      <AnimatePresence>
        {showVolumeBar && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-full -ml-1 mb-4 w-8 h-32 bg-secondary flex items-center justify-center rounded-md shadow-lg"
            style={{ display: showVolumeBar ? 'flex' : 'none' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="transform -rotate-90 w-28"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VolumeControl;
