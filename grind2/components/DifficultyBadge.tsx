import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Difficulty } from '../types';
import { difficultyColors, difficultyBg } from '../constants/colors';
import { fonts, fontSize, spacing, radius } from '../constants/layout';

type Props = { difficulty: Difficulty; size?: 'sm' | 'md' };

export const DifficultyBadge = React.memo(({ difficulty, size = 'sm' }: Props) => {
  const color = difficultyColors[difficulty];
  const bg = difficultyBg[difficulty];
  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: bg }, isSmall && styles.badgeSm]}>
      <Text style={[styles.text, { color }, isSmall && styles.textSm]}>
        {difficulty.toUpperCase()}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 1, borderRadius: radius.full },
  badgeSm: { paddingHorizontal: spacing.sm, paddingVertical: 2 },
  text: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.xs, letterSpacing: 0.5 },
  textSm: { fontSize: 10 },
});
