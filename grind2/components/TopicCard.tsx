import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TopicMeta } from '../types';
import { colors } from '../constants/colors';
import { fonts, fontSize, spacing, radius } from '../constants/layout';
import { useAnimatedPress } from '../hooks/useAnimatedPress';

type Props = { topic: TopicMeta; solved: number; index: number; onPress: () => void };

function ProgressRing({ progress, color, size = 44 }: { progress: number; color: string; size?: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: Math.min(progress, 1), duration: 800, useNativeDriver: false }).start();
  }, [progress]);

  const height = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.ring, { width: size, height: size, borderColor: colors.border }]}>
      <Animated.View style={[styles.ringFill, { backgroundColor: color + '40', height }]} />
      <Text style={[styles.ringText, { color }]}>{Math.round(progress * 100)}%</Text>
    </View>
  );
}

export const TopicCard = React.memo(({ topic, solved, index, onPress }: Props) => {
  const { animatedStyle, onPressIn, onPressOut } = useAnimatedPress(0.95);
  const progress = topic.targetCount > 0 ? solved / topic.targetCount : 0;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.wrapper, animatedStyle, { opacity: fadeAnim, transform: [...(animatedStyle.transform || []), { translateY: slideAnim }] }]}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
        <LinearGradient colors={[topic.gradient[0] + '20', topic.gradient[1] + '08']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
          <View style={[styles.cardBorder, { borderColor: topic.gradient[0] + '30' }]}>
            <View style={styles.topRow}>
              <View style={[styles.iconBg, { backgroundColor: topic.accentColor + '20' }]}>
                <MaterialCommunityIcons name={topic.icon as any} size={22} color={topic.accentColor} />
              </View>
              <ProgressRing progress={progress} color={topic.accentColor} />
            </View>
            <Text style={styles.name} numberOfLines={2}>{topic.displayName}</Text>
            <Text style={styles.count}><Text style={{ color: topic.accentColor }}>{solved}</Text> / {topic.targetCount} solved</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrapper: { flex: 1, maxWidth: '50%', padding: spacing.xs },
  card: { borderRadius: radius.xl, overflow: 'hidden' },
  cardBorder: { borderWidth: 1, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBg: { width: 40, height: 40, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center' },
  name: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.md, color: colors.text, lineHeight: 20 },
  count: { fontFamily: fonts.body, fontSize: fontSize.xs, color: colors.textMuted },
  ring: { borderRadius: 999, borderWidth: 2, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  ringFill: { position: 'absolute', bottom: 0, left: 0, right: 0, borderRadius: 999 },
  ringText: { fontFamily: fonts.monoBold, fontSize: 9, zIndex: 1 },
});
