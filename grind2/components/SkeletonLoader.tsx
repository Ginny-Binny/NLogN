import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../constants/colors';
import { spacing, radius } from '../constants/layout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function ShimmerBlock({ width, height, style }: { width: number | string; height: number; style?: any }) {
  const translate = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(translate, { toValue: SCREEN_WIDTH, duration: 1200, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={[{ width: width as any, height, backgroundColor: colors.surface, borderRadius: radius.md, overflow: 'hidden' }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX: translate }] }]}>
        <LinearGradient colors={['transparent', 'rgba(255,255,255,0.05)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
}

export function SkeletonLoader() {
  return (
    <View style={styles.container}>
      <ShimmerBlock width="100%" height={80} style={{ marginBottom: spacing.lg }} />
      <View style={styles.tabRow}>
        <ShimmerBlock width={80} height={36} />
        <ShimmerBlock width={80} height={36} />
        <ShimmerBlock width={80} height={36} />
      </View>
      <ShimmerBlock width="100%" height={24} style={{ marginBottom: spacing.sm }} />
      <ShimmerBlock width="85%" height={16} style={{ marginBottom: spacing.sm }} />
      <ShimmerBlock width="70%" height={16} style={{ marginBottom: spacing.xl }} />
      <View style={styles.badgeRow}>
        <ShimmerBlock width={100} height={28} />
        <ShimmerBlock width={100} height={28} />
      </View>
      <ShimmerBlock width="100%" height={200} style={{ marginTop: spacing.lg }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg },
  tabRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  badgeRow: { flexDirection: 'row', gap: spacing.sm },
});
