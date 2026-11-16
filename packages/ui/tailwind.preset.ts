/**
 * Preset oficial de Tailwind CSS para Psicoiris ("Serenidad Editorial")
 * Fuente de verdad: docs/propuesta/DESIGN.md y docs/brand/BRAND.md
 */
export const serenidadEditorialPreset = {
  theme: {
    extend: {
      colors: {
        surface: '#fff7fc',
        'surface-bright': '#fff7fc',
        'surface-dim': '#e3d6e6',
        'surface-variant': '#ecdeef',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#fdefff',
        'surface-container': '#f8e9fa',
        'surface-container-high': '#f2e4f4',
        'surface-container-highest': '#ecdeef',
        'on-surface': '#201924',
        'on-surface-variant': '#4c444d',
        primary: '#754d82',
        'primary-accent': '#9F73AB',
        'primary-container': '#90659c',
        'on-primary': '#ffffff',
        secondary: '#715576',
        'secondary-container': '#fbd7ff',
        'on-secondary-container': '#775b7c',
        'rose-dust': '#F4E6E5',
        'lavender-soft': '#E8D3EC',
        'mauve-border': '#D4B2D8',
        'plum-ink': '#2D2531',
        outline: '#7e747e',
        'outline-variant': '#cfc3ce',
        error: '#ba1a1a',
      },
      fontFamily: {
        serif: ['var(--font-newsreader)', 'Newsreader', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      spacing: {
        margin: '1.25rem',
        'margin-desktop': '4rem',
        gutter: '1.5rem',
        'gutter-desktop': '2.5rem',
        'space-xs': '0.5rem',
        'space-sm': '0.75rem',
        'space-md': '1.25rem',
        'space-lg': '2rem',
        'space-xl': '3.5rem',
        'space-2xl': '5rem',
      },
      boxShadow: {
        calmed:
          '0 10px 30px -5px rgba(45, 37, 49, 0.04), 0 20px 40px -15px rgba(159, 115, 171, 0.08)',
      },
    },
  },
} as const;
