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
        onyx: {
          DEFAULT: "#0B0C10",
          950: "#07080A",
          900: "#0B0C10",
          800: "#121316",
          700: "#181A20",
          600: "#22252E",
          500: "#2E323D",
        },
        pearl: {
          DEFAULT: "#F8F9FA",
          100: "#FFFFFF",
          200: "#F8F9FA",
          300: "#E9ECEF",
          400: "#DEE2E6",
        },
        gold: {
          DEFAULT: "#D4AF37",
          300: "#F3E5AB",
          400: "#E6CA65",
          500: "#D4AF37",
          600: "#B59329",
          700: "#8C711D",
        },
        rosegold: {
          DEFAULT: "#B07F6D",
          300: "#D8ADA0",
          400: "#C49585",
          500: "#B07F6D",
          600: "#986756",
        },
        cream: "#F8F9FA",
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