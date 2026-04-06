import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { fonts, fontSize, spacing } from '../constants/layout';

type Props = { icon: string; title: string; subtitle: string };

export function EmptyState({ icon, title, subtitle }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start(); }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      <MaterialCommunityIcons name={icon as any} size={64} color={colors.textDim} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl, gap: spacing.md },
  title: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.lg, color: colors.textMuted, textAlign: 'center' },
  subtitle: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textDim, textAlign: 'center', lineHeight: 20 },
});
