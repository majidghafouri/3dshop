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
        primary: "#3454D1",
        sky: "#169ED9",
        teal: "#15C8B8",
        ink: "#0D1633",
        bodytext: "#53647C",
        soft: "#EEF7FF",
        line: "#DBE8F7",
      },
      fontFamily: {
        sans: [
          "Vazirmatn",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      transitionDuration: {
        220: "220ms",
        250: "250ms",
      },
    },
  },
  plugins: [],
};
export default config;
