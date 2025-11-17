import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          red: '#ff2400',
          DEFAULT: '#ff2400',
        },
        brand: {
          red: '#ff2400',
          black: '#000000',
          white: '#ffffff',
        },
        action: {
          green: '#4CAF50',
          blue: '#2196F3',
          purple: '#9C27B0',
          orangeRed: '#FF5722',
          orange: '#FF9800',
        },
      },
    },
  },
  plugins: [],
}
export default config

