export const colors = {
  bg: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceLight: '#222222',
  border: '#2A2A2A',
  borderLight: '#333333',
  text: '#F0F0F0',
  textMuted: '#888888',
  textDim: '#555555',
  green: '#4ADE80',
  greenDark: '#166534',
  yellow: '#FACC15',
  yellowDark: '#854D0E',
  red: '#F87171',
  redDark: '#991B1B',
  blue: '#60A5FA',
  accent: '#A78BFA',
  accentDark: '#7C3AED',
  codeBg: '#141414',
  overlay: 'rgba(0,0,0,0.7)',
};

export const difficultyColors: Record<string, string> = {
  Easy: colors.green,
  Medium: colors.yellow,
  Hard: colors.red,
};

export const difficultyBg: Record<string, string> = {
  Easy: 'rgba(74, 222, 128, 0.15)',
  Medium: 'rgba(250, 204, 21, 0.15)',
  Hard: 'rgba(248, 113, 113, 0.15)',
};
