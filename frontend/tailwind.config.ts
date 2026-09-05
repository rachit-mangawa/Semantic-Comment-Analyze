import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dual-track canvases
        "canvas-night": "#000000",
        "canvas-night-elevated": "#0a0a0a",
        "surface-elevated-dark": "#1e2c31",
        "canvas-light": "#ffffff",
        "canvas-cream": "#fbfbf5",
        
        // Brand & Text
        primary: {
          DEFAULT: "#000000",
          active: "#3f3f46",
        },
        ink: "#000000",
        "on-primary": "#ffffff",
        "on-dark": "#ffffff",
        
        // Accents (Light track only)
        "aloe-10": "#c1fbd4",
        "pistachio-10": "#d4f9e0",

        // Muted link & cool footer tones
        "link-cool-1": "#9dabad",
        "link-cool-2": "#9797a2",
        "link-cool-3": "#bdbdca",
        "link-mint": "#99b3ad",

        // Hairlines
        "hairline-light": "#e4e4e7",
        "hairline-dark": "#1e2c31",

        // Shade ladder
        shade: {
          30: "#d4d4d8",
          40: "#a1a1aa",
          50: "#71717a",
          60: "#52525b",
          70: "#3f3f46",
        },

        // Backward compatibility fallbacks
        canvas: {
          DEFAULT: "#fbfbf5",
          soft: "#fbfbf5",
          deep: "#000000",
        },
        body: {
          DEFAULT: "#52525b",
          strong: "#000000",
        },
        muted: {
          DEFAULT: "#71717a",
          soft: "#a1a1aa",
        },
        hairline: {
          DEFAULT: "#e4e4e7",
          soft: "#f4f4f5",
          strong: "#d4d4d8",
        },
        surface: {
          card: "#ffffff",
          strong: "#fbfbf5",
          dark: "#000000",
          "dark-elevated": "#0a0a0a",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter Tight", "Helvetica", "Arial", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
        serif: ["var(--font-display)", "Inter Tight", "sans-serif"], // Smooth fallback for any remaining serif classes
      },
      borderRadius: {
        xs: "4px",
        sm: "5px",
        md: "8px",
        lg: "12px",
        xl: "20px",
        pill: "9999px",
      },
      spacing: {
        xxs: "2px",
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        xxl: "32px",
        huge: "64px",
        section: "96px",
      },
      boxShadow: {
        "level-1": "0 1px 2px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.04)",
        "level-2": "0 0 0 1px rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.3), 0 5px 10px rgba(0,0,0,0.2)",
        "level-3": "0 8px 8px rgba(0,0,0,0.03), 0 4px 4px rgba(0,0,0,0.03), 0 2px 2px rgba(0,0,0,0.03), 0 0 0 1px rgba(0,0,0,0.06)",
        "level-4": "0 25px 50px -12px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
