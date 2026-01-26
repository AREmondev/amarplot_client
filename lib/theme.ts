// Design tokens and theme configuration
export const theme = {
  // Color palette
  colors: {
    // Primary brand colors
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    },
    
    // Secondary colors
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    
    // Accent colors
    accent: {
      50: '#fef7ee',
      100: '#fdedd3',
      200: '#fbd7a5',
      300: '#f8bb6d',
      400: '#f59532',
      500: '#f37a0a',
      600: '#e45f05',
      700: '#bd4708',
      800: '#973810',
      900: '#7a2e0e',
      950: '#431504',
    },
    
    // Semantic colors
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    
    // Neutral colors
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      heading: ['var(--font-heading)', 'Poppins', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'Monaco', 'Cascadia Code', 'Segoe UI Mono', 'monospace'],
    },
    
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  
  // Spacing
  spacing: {
    px: '1px',
    0: '0px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  
  // Border radius
  borderRadius: {
    none: '0px',
    sm: '0.125rem',
    DEFAULT: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },
  
  // Breakpoints
  screens: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Z-index scale
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modal: '1040',
    popover: '1050',
    tooltip: '1060',
    toast: '1070',
  },
  
  // Animation
  animation: {
    none: 'none',
    spin: 'spin 1s linear infinite',
    ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    bounce: 'bounce 1s infinite',
    fadeIn: 'fadeIn 0.5s ease-in-out',
    fadeOut: 'fadeOut 0.5s ease-in-out',
    slideIn: 'slideIn 0.3s ease-out',
    slideOut: 'slideOut 0.3s ease-in',
    scaleIn: 'scaleIn 0.2s ease-out',
    scaleOut: 'scaleOut 0.2s ease-in',
  },
  
  // Transitions
  transitionDuration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  
  transitionTimingFunction: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// Theme utilities
export type Theme = typeof theme
export type ColorScale = keyof typeof theme.colors
export type ColorShade = keyof typeof theme.colors.primary

// CSS custom properties generator
export function generateCSSVariables(themeColors: typeof theme.colors) {
  const cssVars: Record<string, string> = {}
  
  Object.entries(themeColors).forEach(([colorName, colorScale]) => {
    if (typeof colorScale === 'object') {
      Object.entries(colorScale).forEach(([shade, value]) => {
        cssVars[`--color-${colorName}-${shade}`] = value
      })
    }
  })
  
  return cssVars
}

// Color utility functions
export function getColor(scale: ColorScale, shade: ColorShade): string {
  return theme.colors[scale][shade as keyof typeof theme.colors[typeof scale]]
}

export function rgba(color: string, alpha: number): string {
  // Convert hex to rgba
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Responsive utilities
export function responsive<T>(values: Partial<Record<keyof typeof theme.screens, T>>): Record<string, T> {
  const result: Record<string, T> = {}
  
  Object.entries(values).forEach(([breakpoint, value]) => {
    if (breakpoint === 'xs') {
      result['@media (min-width: 475px)'] = value
    } else {
      const minWidth = theme.screens[breakpoint as keyof typeof theme.screens]
      result[`@media (min-width: ${minWidth})`] = value
    }
  })
  
  return result
}

// Dark mode utilities
export const darkModeColors = {
  background: theme.colors.neutral[900],
  foreground: theme.colors.neutral[50],
  card: theme.colors.neutral[800],
  cardForeground: theme.colors.neutral[100],
  popover: theme.colors.neutral[800],
  popoverForeground: theme.colors.neutral[100],
  primary: theme.colors.primary[500],
  primaryForeground: theme.colors.neutral[900],
  secondary: theme.colors.neutral[700],
  secondaryForeground: theme.colors.neutral[100],
  muted: theme.colors.neutral[800],
  mutedForeground: theme.colors.neutral[400],
  accent: theme.colors.accent[500],
  accentForeground: theme.colors.neutral[900],
  destructive: theme.colors.error[500],
  destructiveForeground: theme.colors.neutral[50],
  border: theme.colors.neutral[700],
  input: theme.colors.neutral[700],
  ring: theme.colors.primary[400],
}

export const lightModeColors = {
  background: theme.colors.neutral[50],
  foreground: theme.colors.neutral[900],
  card: theme.colors.neutral[50],
  cardForeground: theme.colors.neutral[900],
  popover: theme.colors.neutral[50],
  popoverForeground: theme.colors.neutral[900],
  primary: theme.colors.primary[600],
  primaryForeground: theme.colors.neutral[50],
  secondary: theme.colors.neutral[100],
  secondaryForeground: theme.colors.neutral[900],
  muted: theme.colors.neutral[100],
  mutedForeground: theme.colors.neutral[500],
  accent: theme.colors.accent[500],
  accentForeground: theme.colors.neutral[50],
  destructive: theme.colors.error[500],
  destructiveForeground: theme.colors.neutral[50],
  border: theme.colors.neutral[200],
  input: theme.colors.neutral[200],
  ring: theme.colors.primary[600],
}