export const theme = {
  colors: {
    background: '#1C1917',
    surface: '#292524',
    surfaceLight: '#3D3835',
    text: '#FAFAF9',
    textSecondary: '#A8A29E',
    textMuted: '#78716C',
    accent: '#DC2626',
    accentLight: '#EF4444',
    control: '#D4C4A8',
    controlDark: '#A89880',
    border: '#44403C',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    word: 42,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
} as const;

export type Theme = typeof theme;
