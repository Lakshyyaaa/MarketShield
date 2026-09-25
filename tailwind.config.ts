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
        forest: {
          DEFAULT: "#18280e",
          light: "#243a15",
          dark: "#0f1a09",
        },
        lemongrass: {
          DEFAULT: "#b2eb76",
          hover: "#c3f391",
          muted: "#96d258",
        },
        moss: {
          DEFAULT: "#3f7308",
          light: "#52940b",
        },
        sage: {
          1: "#f4faed",
          2: "#f0fae6",
          3: "#d8e5ca",
          4: "#b3c5a0",
          5: "#4a5b38",
        },
        black: {
          DEFAULT: "#090f05",
          80: "rgba(9, 15, 5, 0.8)",
          60: "rgba(9, 15, 5, 0.6)",
          40: "rgba(9, 15, 5, 0.4)",
          20: "rgba(9, 15, 5, 0.2)",
          10: "rgba(9, 15, 5, 0.1)",
          5: "rgba(9, 15, 5, 0.05)",
          8: "rgba(9, 15, 5, 0.08)",
        },
        sky: "#baebc2",
        lagoon: "#4fa68f",
        sea: "#093328",
        sun: "#ebe46a",
        ochre: "#aa9a33",
        gold: "#333109",
        clay: "#c9753d",
        sand: "#f2dfac",
        earth: "#331b09",
        stone: "#d0c4a5",
        rock: "#a0967a",
        soil: "#29261f",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      spacing: {
        "4.5": "1.125rem",
        "9.75": "2.4375rem",
        "10.75": "2.6875rem",
        "18": "4.5rem",
        "26": "6.5rem",
        "164": "10.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
