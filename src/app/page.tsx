'use client'
import React, { useState } from "react";

export default function Home() {
  const themes = ["nord", "solarizedDark", "solarizedLight"];
  const [theme, setTheme] = useState("nord");

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div
          className={`
        theme-${theme}
        bg-background
        w-screen h-screen 
        flex flex-col justify-center items-center
      `}
        >
          <p className="mb-10 text-primary">当前主题：{theme}</p>
          <span className="text-primary/[0.5]">点击下方按钮切换主题</span>
          <div className="mt-10">
            {themes.map((theme, index) => (
              <button
                key={index}
                className="border rounded p-2 mr-5 bg-secondary text-white"
                onClick={() => setTheme(theme)}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
