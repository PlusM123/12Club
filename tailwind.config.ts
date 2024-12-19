import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundColor: {
        primary: "var(--color-primary)",
        onPrimary: "var(--color-onPrimary)",
        secondary: "var(--color-secondary)",
      },
      textColor: {
        primary: "var(--color-foreground)",
        onPrimary: "var(--color-onPrimary)",
        secondary: "var(--color-secondary)",
      },
    },
  },
  plugins: [],
};

export default config;
