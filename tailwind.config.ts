import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(214, 32%, 91%)",
        background: "hsl(210, 40%, 98%)",
        foreground: "hsl(222, 47%, 11%)",
        muted: {
          DEFAULT: "hsl(210, 40%, 96%)",
          foreground: "hsl(215, 16%, 47%)",
        },
        primary: {
          DEFAULT: "hsl(222, 84%, 56%)",
          foreground: "hsl(210, 40%, 98%)",
        },
        secondary: {
          DEFAULT: "hsl(210, 40%, 96%)",
          foreground: "hsl(222, 47%, 11%)",
        },
        accent: {
          DEFAULT: "hsl(25, 95%, 53%)",
          foreground: "hsl(210, 40%, 98%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 84%, 60%)",
          foreground: "hsl(210, 40%, 98%)",
        },
        card: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(222, 47%, 11%)",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
    },
  },
  plugins: [],
};

export default config;

