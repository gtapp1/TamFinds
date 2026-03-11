export const Colors = {
  primary: '#003829',
  accent: '#FFB81C',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  muted: '#EFEFEF',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  error: '#DC2626',
  success: '#16A34A',
  border: '#E5E7EB',
} as const;

export type ColorKey = keyof typeof Colors;
