"use client";
import React, { useState } from "react";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function Home() {
  const themes = ["white", "rice", "blue", "green", "purple"];
  const [theme, setTheme] = useState("nord");

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
        spaceBetween={50}
        slidesPerView={3}
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        ...
      </Swiper>
    </div>
  );
}
