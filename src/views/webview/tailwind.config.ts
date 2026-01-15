import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // White theme colors from CSS variables
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        ring: "var(--ring)",

        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },

        input: {
          DEFAULT: "var(--input)",
          border: "var(--border)",
        },

        dropdown: {
          DEFAULT: "var(--background)",
          border: "var(--border)",
          foreground: "var(--foreground)",
        },

        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          border: "var(--sidebar-border)",
        },

        // Status colors
        success: {
          DEFAULT: "#22c55e",
        },
        warning: {
          DEFAULT: "#f59e0b",
        },

        // ANSI colors for terminal output
        "ansi-black": "#000000",
        "ansi-red": "#ef4444",
        "ansi-green": "#22c55e",
        "ansi-yellow": "#eab308",
        "ansi-blue": "#3b82f6",
        "ansi-magenta": "#d946ef",
        "ansi-cyan": "#06b6d4",
        "ansi-white": "#f5f5f5",
        "ansi-bright-black": "#737373",
        "ansi-bright-red": "#f87171",
        "ansi-bright-green": "#4ade80",
        "ansi-bright-yellow": "#facc15",
        "ansi-bright-blue": "#60a5fa",
        "ansi-bright-magenta": "#e879f9",
        "ansi-bright-cyan": "#22d3ee",
        "ansi-bright-white": "#ffffff",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "SF Mono",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      fontSize: {
        xs: ["12px", "1.5"],
        sm: ["14px", "1.5"],
        base: ["14px", "1.75"],
        lg: ["16px", "1.75"],
        xl: ["18px", "1.75"],
        "2xl": ["24px", "1.5"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "2xl": "1rem",
        xl: "0.75rem",
        lg: "0.625rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      maxWidth: {
        thread: "44rem",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.15s ease-out",
        "slide-in": "slide-in-from-bottom 0.15s ease-out",
        pulse: "pulse 1.5s ease-in-out infinite",
        spin: "spin 1s linear infinite",
      },
    },
  },
  plugins: [tailwindAnimate],
};

export default config;
