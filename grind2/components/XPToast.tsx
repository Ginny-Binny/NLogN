import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants/colors';
import { fonts, fontSize, spacing, radius } from '../constants/layout';

type Props = { xp: number; visible: boolean; onDismiss: () => void };

export function XPToast({ xp, visible, onDismiss }: Props) {
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 15 }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, { toValue: -30, duration: 300, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(onDismiss);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      translateY.setValue(50);
      opacity.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      <Text style={styles.text}>+{xp} XP</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: colors.accentDark, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm + 2, borderRadius: radius.full, borderWidth: 1, borderColor: colors.accent },
  text: { fontFamily: fonts.bodyBold, fontSize: fontSize.md, color: '#fff' },
});
