'use client';
import React, { useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function Home() {
  const themes = ['white', 'rice', 'blue', 'green', 'purple'];
  const [theme, setTheme] = useState('white');
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      className={`
        theme-${theme}
        bg-primary
        w-screen h-screen 
        flex flex-col justify-center items-center
      `}
    >
      <p className="mb-10 text-onPrimary text-5xl font-bold">{theme}</p>
      <p className="mb-10 text-onPrimary text-5xl font-bold bg-secondary">bg-secondary text-onPrimary</p>
      <div className="mt-10 flex flex-row justify-center items-center gap-5">
        {themes.map((theme, index) => (
          <button
            key={index}
            className="rounded px-6 py-2 text-xl font-black bg-secondary text-onPrimary"
            onClick={() => setTheme(theme)}
          >
            {theme}
          </button>
        ))}
      </div>
      <Swiper
        className="w-[50%] mt-10 text-center"
        spaceBetween={30}
        slidesPerView={3}
        loop={true}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={(swiper) => {
          console.log('slide change');
          setActiveIndex(swiper.realIndex);
        }}
      >
        {Array.from({ length: 10 }, (_, index) => (
          <SwiperSlide
            key={index}
            className={`bg-${index % 2 === 0 ? 'secondary' : 'onPrimary'} text-${index % 2 === 0 ? 'onPrimary' : 'secondary'} p-5 border ${
              index === activeIndex - 1 ? 'rotate-[-30deg]' : index === activeIndex + 1 ? 'rotate-[30deg]' : ''
            }`}
          >
            {index % 2 === 0 ? 'bg-secondary' : 'bg-onPrimary'}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
