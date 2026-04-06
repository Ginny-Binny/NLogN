import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import { fonts, fontSize, spacing, radius } from '../constants/layout';
import { levelFromXP, xpInCurrentLevel, XP_PER_LEVEL } from '../lib/xp';

type Props = { xp: number };

export function XPBar({ xp }: Props) {
  const level = levelFromXP(xp);
  const currentXP = xpInCurrentLevel(xp);
  const progress = currentXP / XP_PER_LEVEL;
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, { toValue: progress, duration: 800, useNativeDriver: false }).start();
  }, [progress]);

  const barWidth = widthAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.container}>
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>LVL</Text>
        <Text style={styles.levelNumber}>{level}</Text>
      </View>
      <View style={styles.barContainer}>
        <View style={styles.barBg}>
          <Animated.View style={[styles.barFill, { width: barWidth }]}>
            <LinearGradient colors={[colors.accent, colors.accentDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
          </Animated.View>
        </View>
        <Text style={styles.xpText}>{currentXP} / {XP_PER_LEVEL} XP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  levelBadge: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  levelText: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.xs, color: colors.textMuted, letterSpacing: 1 },
  levelNumber: { fontFamily: fonts.bodyBold, fontSize: fontSize.xl, color: colors.accent },
  barContainer: { flex: 1, gap: spacing.xs },
  barBg: {
    height: 8, backgroundColor: colors.surface, borderRadius: radius.full, overflow: 'hidden',
    ...(Platform.OS === 'ios' ? { shadowColor: colors.accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 6 } : { elevation: 2 }),
  },
  barFill: { height: '100%', borderRadius: radius.full, overflow: 'hidden' },
  xpText: { fontFamily: fonts.mono, fontSize: 10, color: colors.textDim, textAlign: 'right' },
});
