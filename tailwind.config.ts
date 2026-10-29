import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        emerald: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        indigo: {
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
        },
        rose: {
          400: "#fb7185",
          500: "#f43f5e",
        },
        slate: {
          950: "#020617",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bar-grow": "bar-grow 0.8s ease-out forwards",
      },
      keyframes: {
        "bar-grow": {
          "0%": { width: "0%" },
          "100%": { width: "var(--bar-width)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
