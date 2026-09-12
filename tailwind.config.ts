import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        chocolate: {
          900: "#1E120D",
          800: "#2B1912",
          700: "#3D241A",
          600: "#5A3626",
          500: "#7A4933",
        },
        gold: {
          300: "#F3E5AB",
          400: "#D4AF37",
          500: "#C59B27",
          600: "#AA8222",
        },
        cream: "#FDFBF7",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;