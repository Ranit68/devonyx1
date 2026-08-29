/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2B4BFF',
          light: '#4C68FF',
          dark: '#1E37C9',
          darker: '#16289E',
        },
        accent: '#E8A33D',
        paper: '#F5F4F0',
        surface: '#FFFFFF',
        hairline: '#E5E2DA',
        ink: {
          DEFAULT: '#14141B',
          soft: '#3C3C48',
          muted: '#666673',
          faint: '#8C8C98',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'marquee': 'marquee 40s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.45 },
          '50%': { opacity: 0.85 },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #2B4BFF 0%, #4C68FF 60%, #7C6BFF 100%)',
        'brand-gradient-subtle': 'linear-gradient(135deg, rgba(43,75,255,0.10) 0%, rgba(124,120,255,0.10) 100%)',
        'ink-gradient': 'linear-gradient(135deg, #14141B 0%, #26263A 100%)',
      },
    },
  },
  plugins: [],
}
