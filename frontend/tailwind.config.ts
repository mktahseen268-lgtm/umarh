import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        /* Brand green — #0d7434 */
        primary: {
          50:  "#f0faf3",
          100: "#d9f2e0",
          200: "#b3e5c1",
          300: "#7dd0a0",
          400: "#47b97c",
          500: "#1f9c58",
          600: "#148042",
          700: "#0d7434",
          800: "#0a5d2a",
          900: "#074a21",
          950: "#03280f",
          DEFAULT: "#0d7434",
          foreground: "#ffffff",
        },
        /* Brand yellow/gold — #ffca01 */
        accent: {
          50:  "#fffdf0",
          100: "#fff8c4",
          200: "#fff099",
          300: "#ffe066",
          400: "#ffd133",
          500: "#ffca01",
          600: "#e6b500",
          700: "#cc9f00",
          DEFAULT: "#ffca01",
          foreground: "#0f1416",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        neutral: {
          50:  "#f9f9f9",
          100: "#f7f8fc",
          200: "#e7e6e6",
          300: "#e0e0e0",
          400: "#a6aaac",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#222222",
          900: "#0f1416",
        },
        dark: "#0f1416",
      },
      fontFamily: {
        sans:    ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-volkhov)", "Georgia", "serif"],
        arabic:  ["var(--font-ibm-arabic)", "Tajawal", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        full: "9999px",
      },
      boxShadow: {
        card:  "0 2px 8px rgba(0,0,0,0.07)",
        modal: "0 10px 40px rgba(0,0,0,0.08)",
        green: "0 4px 20px rgba(39,71,96,0.17)",
        hero:  "0px 4px 21px 1px rgba(0,197,114,0.10)",
      },
      maxWidth: {
        content: "1140px",
      },
      keyframes: {
        "ken-burns": {
          "0%":   { transform: "scale(1.0)" },
          "50%":  { transform: "scale(1.05)" },
          "100%": { transform: "scale(1.0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "fade-in-up": {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "ken-burns":     "ken-burns 20s ease-in-out infinite",
        shimmer:         "shimmer 1.5s linear infinite",
        "fade-in-up":    "fade-in-up 0.5s ease-out forwards",
        "accordion-down":"accordion-down 0.2s ease-out",
        "accordion-up":  "accordion-up 0.2s ease-out",
        float:           "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
