export const Colors = {
  primary: '#003829',
  primaryEmphasis: '#0B6A50',
  accent: '#FFB81C',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceAlt: '#F3F7F4',
  surfaceOverlayStrong: 'rgba(255,255,255,0.97)',
  surfaceOverlaySubtle: 'rgba(255,255,255,0.75)',
  muted: '#EFEFEF',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  error: '#DC2626',
  errorSoft: '#FEE2E2',
  success: '#16A34A',
  successSoft: '#DCFCE7',
  border: '#E5E7EB',
} as const;

export type ColorKey = keyof typeof Colors;
