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
        primary: "#F47216",
        "primary-dark": "#D9620E",
        "primary-light": "#FFF4EB",
        accent: "#00A650",
        "accent-dark": "#008C44",
        "accent-light": "#E8F8EF",
        cream: "#FFFAF5",
        surface: "#FEF7F0",
        muted: "#6B7280",
        border: "#E5E7EB",
        text: "#1A1A2E",
        "text-light": "#374151",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        heading: [
          "Anton",
          "Noto Sans Tamil",
          "Noto Sans Devanagari",
          "Impact",
          "Haettenschweiler",
          "Arial Narrow",
          "system-ui",
          "sans-serif",
        ],
      },
      maxWidth: {
        container: "1200px",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        card: "none",
        "card-hover": "none",
        glow: "none",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "marquee-vertical": "marquee-vertical var(--duration, 30s) linear infinite",
        "fade-in-up": "fade-in-up 0.75s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-100%)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
