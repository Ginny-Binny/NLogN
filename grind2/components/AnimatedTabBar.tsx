import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, Animated } from 'react-native';
import { colors } from '../constants/colors';
import { fonts, fontSize, spacing, radius } from '../constants/layout';
import { hapticLight } from '../lib/haptics';

type Props = { tabs: string[]; activeIndex: number; onTabPress: (index: number) => void };

const TAB_COLORS = [colors.red, colors.yellow, colors.green];

export function AnimatedTabBar({ tabs, activeIndex, onTabPress }: Props) {
  const containerWidth = Dimensions.get('window').width - spacing.lg * 2;
  const tabWidth = containerWidth / tabs.length;
  const translateX = useRef(new Animated.Value(activeIndex * tabWidth)).current;

  useEffect(() => {
    Animated.spring(translateX, { toValue: activeIndex * tabWidth, useNativeDriver: true, damping: 20, stiffness: 200 }).start();
  }, [activeIndex]);

  const indicatorColor = TAB_COLORS[activeIndex] || colors.accent;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.indicator, { transform: [{ translateX }], width: tabWidth - spacing.sm * 2, marginLeft: spacing.sm, backgroundColor: indicatorColor + '33' }]} />
      {tabs.map((tab, i) => (
        <Pressable key={tab} onPress={() => { hapticLight(); onTabPress(i); }} style={[styles.tab, { width: tabWidth }]}>
          <Text style={[styles.tabText, i === activeIndex && styles.tabTextActive]} numberOfLines={1}>{tab}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg, position: 'relative', overflow: 'hidden', marginHorizontal: spacing.lg },
  indicator: { position: 'absolute', top: 4, bottom: 4, borderRadius: radius.md },
  tab: { paddingVertical: spacing.md, alignItems: 'center', justifyContent: 'center' },
  tabText: { fontFamily: fonts.bodyMedium, fontSize: fontSize.sm, color: colors.textMuted },
  tabTextActive: { fontFamily: fonts.bodyBold, color: colors.text },
});
