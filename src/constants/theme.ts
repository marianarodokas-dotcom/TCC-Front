import { Platform } from 'react-native';

export const COLORS = {
  green: '#00502D',
  greenDark: '#003F24',
  cream: '#F5F0DC',
  terracotta: '#B95B54',
  terracottaDark: '#9E3E38',
  red: '#A90000',
  redDark: '#870000',
  gold: '#D8C98F',
  text: '#202020',
  muted: '#6E6E6E',
  white: '#FFFFFF',
  border: '#D9CFAB',
  success: '#2F7D32',
  warning: '#C47B00',
  background: '#F5F0DC',
  cardBg: '#FFFFFF',
  headerBg: '#00502D',
  primary: '#A90000',
} as const;

export const ROLE_LABELS = {
  ADMIN: 'ADMINISTRADOR',
  CENTRAL: 'CENTRAL',
  FUNCIONARIO: 'FUNCIONÁRIO',
  BRIGADISTA: 'BRIGADISTA',
} as const;

export const OCCURRENCE_STATUS = [
  'DETECTADA',
  'EM_ANALISE',
  'ATRIBUIDA',
  'ACEITA',
  'A_CAMINHO',
  'ATENDIDA',
  'ENCERRADA',
  'FALSA_DETECCAO',
] as const;

export const RISK_LABELS = {
  BAIXO: 'BAIXO',
  MEDIO: 'MÉDIO',
  ALTO: 'ALTO',
  CRITICO: 'CRÍTICO',
} as const;

export const ROLE_VALUES = ['ADMIN', 'CENTRAL', 'FUNCIONARIO', 'BRIGADISTA'] as const;

export const STATUS_LABELS: Record<string, string> = {
  DETECTADA: 'DETECTADO',
  EM_ANALISE: 'EM ANÁLISE',
  ATRIBUIDA: 'ATRIBUÍDA',
  ACEITA: 'ACEITA',
  A_CAMINHO: 'A CAMINHO',
  ATENDIDA: 'ATENDIDA',
  ENCERRADA: 'ENCERRADA',
  FALSA_DETECCAO: 'FALSA DETECÇÃO',
};


export const Colors = {
  light: { text: COLORS.text, background: COLORS.cream, backgroundElement: COLORS.white, backgroundSelected: '#EAE3CD', textSecondary: COLORS.muted },
  dark: { text: COLORS.white, background: COLORS.greenDark, backgroundElement: COLORS.green, backgroundSelected: COLORS.green, textSecondary: '#D8D8D8' },
} as const;
export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: { sans: 'var(--font-display)', serif: 'var(--font-serif)', rounded: 'var(--font-rounded)', mono: 'var(--font-mono)' },
});
export const Spacing = { half: 2, one: 4, two: 8, three: 16, four: 24, five: 32, six: 64 } as const;
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
