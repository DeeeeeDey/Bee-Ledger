/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        honey: {
          gold: 'var(--honey-gold)',
          amber: 'var(--honey-amber)',
          deep: 'var(--honey-deep)',
        },
        comb: {
          brown: 'var(--comb-brown)',
          light: 'var(--comb-brown-light)',
        },
        cream: {
          bg: 'var(--cream-bg)',
          card: 'var(--cream-card)',
        },
        wax: {
          beige: 'var(--wax-beige)',
        },
        status: {
          success: 'var(--success-green)',
          alert: 'var(--alert-red)',
          pending: 'var(--pending-amber)',
        }
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': 'var(--card-shadow)',
        'card-hover': 'var(--card-shadow-hover)',
        'glow': 'var(--glow-gold)',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        shake: 'shake 0.4s ease-in-out',
        'spin-slow': 'spinSlow 3s linear infinite',
      }
    },
  },
  plugins: [],
}
