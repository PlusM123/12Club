'use client';
import React, { useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards,Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

export default function Home() {
  const themes = ['white', 'rice', 'blue', 'green', 'purple'];
  const [theme, setTheme] = useState('white');

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
        className="w-[50%] mt-10  text-center"
        // install Swiper modules
        modules={[EffectCards,Mousewheel]}
        effect="cards"
        mousewheel={true}
        spaceBetween={50}
        slidesPerView={3}
        loop={true}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
      >
        {Array.from({ length: 10 }, (_, index) => (
          <SwiperSlide
            key={index}
            className={`bg-${index % 2 === 0 ? 'secondary' : 'onPrimary'} text-${index % 2 === 0 ? 'onPrimary' : 'secondary'} p-5`}
          >
            Slide {index + 1}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
