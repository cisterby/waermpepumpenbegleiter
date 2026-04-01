import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── WP Brand Colors ──────────────────────────────────────
        wp: {
          green:      '#1B5E37',   // primary brand green
          green2:     '#2A7D4F',   // mid green (hover states)
          green3:     '#3DA16A',   // light green (accents, icons)
          greenlt:    '#E8F5EE',   // light green bg
          greenxlt:   '#F2FAF5',   // extra light green bg
          amber:      '#D97706',   // amber/gold (savings, CTA)
          amberlt:    '#FEF3C7',   // amber light bg
          dark:       '#1A3728',   // dark sections bg
          darker:     '#0A1710',   // footer bg
          bg:         '#F8F9FA',   // page background
          white:      '#FFFFFF',
          // Text
          text:       '#111827',   // primary text
          text2:      '#4B5563',   // secondary text
          text3:      '#9CA3AF',   // muted text
          textinv:    '#F0FAF4',   // text on dark bg
          // Borders
          border:     '#E5E7EB',
          borderl:    'rgba(27,94,55,0.12)', // subtle green border
          // ── Aliases (used in Nav/Footer/templates) ──────────────
          primary:       '#1B5E37',   // alias for green
          'primary-mid': '#2A7D4F',   // alias for green2
          'primary-light':'#3DA16A',  // alias for green3
          accent:        '#D97706',   // alias for amber
          'accent-light':'#F59E0B',   // amber lighter
          base:          '#F8F9FA',   // alias for bg
          'text-on-dark':'#F0FAF4',   // alias for textinv
          'text-secondary':'#4B5563', // alias for text2
          'text-light':  '#9CA3AF',   // alias for text3
        },
        // ── Additional tokens used in components ──────────────
        'wp-primary':       '#1A4731',
        'wp-dark':          '#1A4731',
        'wp-border':        '#E5E7EB',
        'wp-primary-mid':   '#2D7A52',
        'wp-primary-light': '#4CAF7D',
        'wp-accent':        '#B45309',
        'wp-text-on-dark':  '#F0FAF4',
        'wp-text-secondary':'#4A6358',
        'wp-text-muted':    '#7A9E8E',

        // shadcn/ui tokens
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        // Outfit — headings, bold UI labels
        heading: ['Outfit', 'system-ui', 'sans-serif'],
        // DM Sans — body copy, form elements
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        // JetBrains Mono — numbers, prices, stats
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'wp-sm': '0 1px 3px rgba(27,94,55,0.08), 0 4px 16px rgba(27,94,55,0.04)',
        'wp-md': '0 4px 6px rgba(27,94,55,0.05), 0 8px 24px rgba(27,94,55,0.08)',
        'wp-lg': '0 4px 6px rgba(27,94,55,0.05), 0 16px 48px rgba(27,94,55,0.12)',
        'wp-xl': '0 8px 40px rgba(27,94,55,0.18)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.35' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'bar-fill': {
          from:  { transform: 'scaleX(0)' },
          to:    { transform: 'scaleX(1)' },
        },
        'count-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'pulse-dot':      'pulse-dot 2s ease-in-out infinite',
        float:            'float 6s ease-in-out infinite',
        'bar-fill':       'bar-fill 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'count-up':       'count-up 0.4s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
