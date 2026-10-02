import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F9F8",
        ink: "#0F2A2E",
        surface: "#FFFFFF",
        line: "#DDE5E2",
        primary: {
          DEFAULT: "#146356",
          bright: "#1F8A76",
          dark: "#0B4038",
          50: "#EAF4F1",
        },
        accent: {
          DEFAULT: "#E0762F",
          dark: "#C25F1F",
          50: "#FCEEE1",
        },
        danger: "#C4432B",
        success: "#2E8B57",
      },
      fontFamily: {
        kufi: ["var(--font-kufi)", "sans-serif"],
        plex: ["var(--font-plex)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 42, 46, 0.06), 0 4px 16px rgba(15, 42, 46, 0.04)",
        glow: "0 0 0 1px rgba(31,138,118,0.25), 0 0 40px rgba(31,138,118,0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
