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
        // Light dollar-bill sage green — background
        sage: {
          50: "#f2f5ed",
          100: "#e5eadb",
          200: "#dae2ce",
          300: "#c8d4b8",
          400: "#b0c09a",
          500: "#97ab7c",
        },
        // Dark navy from the logo circles and text
        navy: {
          50: "#f0f3f9",
          100: "#d9e0ef",
          200: "#b3c1df",
          300: "#8da2cf",
          400: "#6783bf",
          500: "#4164af",
          600: "#34508c",
          700: "#273c69",
          800: "#1a2846",
          900: "#0d1423",
          950: "#070a12",
        },
        // Warm orange-amber from the globe center
        flame: {
          50: "#fff7ed",
          100: "#ffeed4",
          200: "#fdd9a8",
          300: "#fbbe71",
          400: "#f59e38",
          500: "#e87f14",
          600: "#c45a0a",
          700: "#a3420c",
          800: "#843510",
          900: "#6c2d10",
        },
        // Deep red-brown from the inner rays
        ember: {
          50: "#fdf3f0",
          100: "#fbe4dc",
          200: "#f8c9b9",
          300: "#f2a48c",
          400: "#e8755a",
          500: "#d4512f",
          600: "#b83a1e",
          700: "#8b2d18",
          800: "#6e2616",
          900: "#5c2216",
        },
      },
      fontFamily: {
        heading: ['"Georgia"', "serif"],
        body: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
