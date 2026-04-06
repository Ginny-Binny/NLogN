import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { fonts, fontSize, spacing, radius } from '../constants/layout';

type Props = { complexity: string; type: 'time' | 'space' };

function getColor(c: string): string {
  const l = c.toLowerCase();
  if (l.includes('o(1)') || l.includes('o(log')) return colors.green;
  if (l.includes('o(n)') || l.includes('o(n log') || l.includes('o(n*log')) return colors.yellow;
  return colors.red;
}

function getBg(c: string): string {
  const l = c.toLowerCase();
  if (l.includes('o(1)') || l.includes('o(log')) return 'rgba(74,222,128,0.12)';
  if (l.includes('o(n)') || l.includes('o(n log') || l.includes('o(n*log')) return 'rgba(250,204,21,0.12)';
  return 'rgba(248,113,113,0.12)';
}

export const ComplexityBadge = React.memo(({ complexity, type }: Props) => {
  const color = getColor(complexity);
  const bg = getBg(complexity);
  const icon = type === 'time' ? 'clock-outline' : 'memory';
  const match = complexity.match(/O\([^)]+\)/i);
  const display = match ? match[0] : complexity;

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <MaterialCommunityIcons name={icon as any} size={13} color={color} />
      <Text style={[styles.text, { color }]}>{display}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xs + 1, borderRadius: radius.full },
  text: { fontFamily: fonts.mono, fontSize: fontSize.xs },
});
