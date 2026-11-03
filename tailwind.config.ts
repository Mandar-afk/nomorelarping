import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#090909',
        'bg-secondary': '#171717',
        'bg-tertiary': '#1f1f1f',
        accent: '#DC2626',
        'accent-muted': '#991b1b',
        'border-base': '#2a2a2a',
        'text-primary': '#f5f5f5',
        'text-secondary': '#9ca3af',
        'text-disabled': '#4b5563',
        'priority-high': '#DC2626',
        'priority-medium': '#d97706',
        'priority-low': '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
