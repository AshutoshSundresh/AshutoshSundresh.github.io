/** @type {import('tailwindcss').Config} */

// Import color constants for reference
// Note: Tailwind config doesn't support ES6 imports, so we keep the colors inline
// but reference app/constants/colors.ts for the source of truth

module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        array: ['Array', 'sans-serif'],
      },
      colors: {
        // Shadcn/UI theme colors (using CSS variables)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
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
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom semantic colors (defined in app/constants/colors.ts)
        'selection-blue': '#0069d9',
        'nav-bg': '#2A2A2A',
        'nav-text': '#CCCCCC',
        'terminal-green': '#33ff33',
        'contributions-bg': '#282a36',
        
        // Dark mode colors (darker aesthetic for better contrast)
        'dark-primary': '#1a1b26',
        'dark-secondary': '#16161e',
        'dark-tertiary': '#0f0f14',
        'dark-elevated': '#24283b',
        'dark-text-primary': '#c0caf5',
        'dark-text-secondary': '#a9b1d6',
        'dark-text-tertiary': '#9aa5ce',
        'dark-border-primary': '#292e42',
        'dark-border-secondary': '#1f2335',
        
        // MacOS Finder/Window specific colors (from app/constants/colors.ts)
        'macos-content': '#1e1e1e',
        'macos-sidebar': '#181818',
        'macos-section': '#202020',
        'macos-card': '#2b2b2b',
        'macos-hover': '#333333',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "gradient-slow": "gradient 8s ease infinite",
      },
      keyframes: {
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
