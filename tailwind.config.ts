import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Industrial Skeuomorphism Palette
        chassis: "#e0e5ec",
        panel: "#f0f2f5",
        muted: "#d1d9e6",
        
        // Text colors
        ink: "#2d3436",
        "ink-muted": "#4a5568",
        
        // Shadow system
        shadow: "#babecc",
        highlight: "#ffffff",
        "shadow-deep": "#a3b1c6",
        
        // Safety Orange Accent
        accent: {
          DEFAULT: "#ff4757",
          hover: "#ff6b7a",
          active: "#e8414f",
          glow: "rgba(255, 71, 87, 0.6)",
          foreground: "#ffffff",
        },
        
        // Dark panels
        "dark-panel": "#2d3436",
        
        // Semantic colors
        success: {
          DEFAULT: "#10b981",
          light: "#d1fae5",
          glow: "rgba(16, 185, 129, 0.6)",
        },
        warning: {
          DEFAULT: "#f59e0b",
          light: "#fef3c7",
        },
        error: {
          DEFAULT: "#ef4444",
          light: "#fee2e2",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Roboto Mono", "monospace"],
      },
      boxShadow: {
        // Neumorphic shadow system
        "neu-card": "8px 8px 16px #babecc, -8px -8px 16px #ffffff",
        "neu-floating": "12px 12px 24px #babecc, -12px -12px 24px #ffffff",
        "neu-pressed": "inset 6px 6px 12px #babecc, inset -6px -6px 12px #ffffff",
        "neu-recessed": "inset 4px 4px 8px #babecc, inset -4px -4px 8px #ffffff",
        "neu-button": "4px 4px 8px #babecc, -4px -4px 8px #ffffff",
        "neu-accent": "4px 4px 8px rgba(166, 50, 60, 0.4), -4px -4px 8px rgba(255, 100, 110, 0.3)",
        // LED glows
        "led-green": "0 0 10px 2px rgba(16, 185, 129, 0.6)",
        "led-red": "0 0 10px 2px rgba(255, 71, 87, 0.6)",
      },
      borderRadius: {
        "sm": "4px",
        "md": "8px",
        "lg": "16px",
        "xl": "24px",
        "2xl": "30px",
      },
      transitionTimingFunction: {
        "mechanical": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "slide-up": "slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "glow": "glow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
