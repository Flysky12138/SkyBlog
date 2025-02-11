import typography from '@tailwindcss/typography'
import { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import components from './tailwind.components'

export default {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: ['class', 'html[data-joy-color-scheme="dark"]'],
  important: '#next',
  plugins: [
    typography,
    plugin(({ addComponents }) => {
      addComponents(components, {
        respectImportant: true
      })
    }),
    require('tailwindcss-animate')
  ],
  theme: {
    extend: {
      borderRadius: {
        inherit: 'inherit',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        background: 'hsl(var(--background))',
        border: 'hsl(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        foreground: 'hsl(var(--foreground))',
        input: 'hsl(var(--input))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        ring: 'hsl(var(--ring))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      fontFamily: {
        body: '"Microsoft Yahei", "微软雅黑", arial, sans-serif',
        code: '"Cascadia Code PL"',
        inherit: 'inherit',
        root: 'FZSJ-ZHUZAYTE',
        title: 'var(--font-title)'
      },
      height: {
        footer: '150px',
        header: '50px',
        inherit: 'inherit'
      },
      zIndex: {
        footer: '10',
        header: '100',
        main: '25',
        nav: '50'
      }
    }
  }
} satisfies Config
