import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{md,mdx}'],
  theme: {
    extend: {
      colors: {
        clay: '#D08C72',       // primary accent
        teal: '#5F7C74',       // secondary accent
        porcelain: '#F5F1EB',  // base background
        sand: '#CBBBA0',       // dividers / subtle borders
        ink: '#1F1F1F',        // body text
        paper: '#FFFFFF'       // cards on porcelain bg
      },
      borderColor: {
        DEFAULT: '#CBBBA0'     // sand as default border
      },
      fontFamily: {
        serif: ['var(--font-bree-serif)', '"Bree Serif"', 'serif'],
        sans: ['var(--font-manrope)', 'Manrope', 'sans-serif'],
      }
    }
  },
  plugins: []
} satisfies Config