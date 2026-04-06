import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants/colors';
import { fonts, fontSize, spacing } from '../constants/layout';
import { hapticSuccess } from '../lib/haptics';

type Props = { visible: boolean; level: number; onDismiss: () => void };

export function LevelUpModal({ visible, level, onDismiss }: Props) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      hapticSuccess();
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 12 }),
      ]).start();
      const timer = setTimeout(onDismiss, 4000);
      return () => clearTimeout(timer);
    } else {
      scale.setValue(0);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
      <Animated.View style={[styles.content, { transform: [{ scale }] }]}>
        <Text style={styles.label}>LEVEL UP!</Text>
        <Text style={styles.level}>{level}</Text>
        <Text style={styles.subtitle}>Keep grinding!</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay, justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  content: { alignItems: 'center', gap: spacing.sm },
  label: { fontFamily: fonts.bodyBold, fontSize: fontSize.xxl, color: colors.yellow, letterSpacing: 4, textShadowColor: 'rgba(250,204,21,0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 },
  level: { fontFamily: fonts.bodyBold, fontSize: 72, color: colors.accent, textShadowColor: 'rgba(167,139,250,0.6)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 30 },
  subtitle: { fontFamily: fonts.bodyMedium, fontSize: fontSize.md, color: colors.textMuted, marginTop: spacing.sm },
});
