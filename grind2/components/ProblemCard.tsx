import React, { useCallback, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Problem } from '../types';
import { colors } from '../constants/colors';
import { fonts, fontSize, spacing, radius } from '../constants/layout';
import { useAnimatedPress } from '../hooks/useAnimatedPress';
import { DifficultyBadge } from './DifficultyBadge';
import { hapticLight } from '../lib/haptics';

type Props = { problem: Problem; index: number; isSolved: boolean; isBookmarked: boolean; onPress: () => void; onBookmark: () => void };

export const ProblemCard = React.memo(({ problem, index, isSolved, isBookmarked, onPress, onBookmark }: Props) => {
  const { animatedStyle, onPressIn, onPressOut } = useAnimatedPress(0.97);
  const bookmarkScale = useRef(new Animated.Value(1)).current;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    const delay = Math.min(index, 10) * 50;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 350, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleBookmark = useCallback(() => {
    hapticLight();
    Animated.sequence([
      Animated.timing(bookmarkScale, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.timing(bookmarkScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    onBookmark();
  }, [onBookmark]);

  return (
    <Animated.View style={[animatedStyle, { opacity: fadeAnim, transform: [...(animatedStyle.transform || []), { translateX: slideAnim }] }]}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress} style={styles.card}>
        <View style={styles.left}>
          <Text style={styles.lcNumber}>#{problem.lcNumber}</Text>
          <Text style={styles.title} numberOfLines={1}>{problem.title}</Text>
        </View>
        <View style={styles.right}>
          <DifficultyBadge difficulty={problem.difficulty} />
          {isSolved && <MaterialCommunityIcons name="check-circle" size={20} color={colors.green} />}
          <Pressable onPress={handleBookmark} hitSlop={12}>
            <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
              <MaterialCommunityIcons name={isBookmarked ? 'star' : 'star-outline'} size={20} color={isBookmarked ? colors.yellow : colors.textDim} />
            </Animated.View>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, marginHorizontal: spacing.lg, marginVertical: spacing.xs, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  left: { flex: 1, gap: 2, marginRight: spacing.md },
  lcNumber: { fontFamily: fonts.mono, fontSize: fontSize.xs, color: colors.textDim },
  title: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.md, color: colors.text },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
