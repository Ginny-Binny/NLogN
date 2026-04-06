import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Animated, Dimensions, GestureResponderEvent, PanResponder } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, difficultyColors } from '../../constants/colors';
import { fonts, fontSize, spacing, radius } from '../../constants/layout';
import { getProblemById } from '../../data/problems';
import { useProgress } from '../../hooks/useProgress';
import { useSolution } from '../../hooks/useSolution';
import { AnimatedTabBar } from '../../components/AnimatedTabBar';
import { ApproachCard } from '../../components/ApproachCard';
import { SkeletonLoader } from '../../components/SkeletonLoader';
import { XPToast } from '../../components/XPToast';
import { hapticLight, hapticSuccess } from '../../lib/haptics';

const SWIPE_THRESHOLD = 60;

function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const touchStart = useRef(0);
  const touchStartY = useRef(0);
  const onTouchStart = (e: GestureResponderEvent) => {
    touchStart.current = e.nativeEvent.pageX;
    touchStartY.current = e.nativeEvent.pageY;
  };
  const onTouchEnd = (e: GestureResponderEvent) => {
    const dx = e.nativeEvent.pageX - touchStart.current;
    const dy = Math.abs(e.nativeEvent.pageY - touchStartY.current);
    if (dy > Math.abs(dx)) return; // vertical scroll, ignore
    if (dx < -SWIPE_THRESHOLD) onSwipeLeft();
    if (dx > SWIPE_THRESHOLD) onSwipeRight();
  };
  return { onTouchStart, onTouchEnd };
}

export default function ProblemDetail() {
  const { problemId } = useLocalSearchParams<{ problemId: string }>();
  const router = useRouter();
  const { isSolved, isBookmarked, toggleBookmark, markSolved } = useProgress();

  const problem = getProblemById(problemId || '');
  const { solution, loading, error, retry } = useSolution(problem);
  const [activeApproach, setActiveApproach] = useState(2);
  const [viewMode, setViewMode] = useState<'question' | 'solution'>('question');
  const [showXPToast, setShowXPToast] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const bookmarkScale = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (solution) {
      Animated.timing(fadeIn, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }
  }, [solution]);

  // Swipe handlers
  const mainSwipe = useSwipe(
    () => { if (viewMode === 'question') { hapticLight(); setViewMode('solution'); scrollRef.current?.scrollTo({ y: 0, animated: false }); } },
    () => { if (viewMode === 'solution') { hapticLight(); setViewMode('question'); scrollRef.current?.scrollTo({ y: 0, animated: false }); } },
  );

  const approachSwipe = useSwipe(
    () => { if (activeApproach < 2) { hapticLight(); setActiveApproach(p => p + 1); } },
    () => { if (activeApproach > 0) { hapticLight(); setActiveApproach(p => p - 1); } },
  );

  const handleBookmark = useCallback(() => {
    if (!problem) return;
    hapticLight();
    Animated.sequence([
      Animated.timing(bookmarkScale, { toValue: 1.3, duration: 150, useNativeDriver: true }),
      Animated.timing(bookmarkScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
    toggleBookmark(problem.id);
  }, [problem, toggleBookmark]);

  const handleSolve = useCallback(() => {
    if (!problem || isSolved(problem.id)) return;
    hapticSuccess();
    const result = markSolved(problem.id, problem.difficulty);
    setXpGained(result.xpGained);
    setShowXPToast(true);
  }, [problem, isSolved, markSolved]);

  if (!problem) return null;

  const solved = isSolved(problem.id);
  const bookmarked = isBookmarked(problem.id);
  const diffColor = difficultyColors[problem.difficulty];
  const approachNames = solution
    ? solution.approaches.map((a) => {
        if (a.name.toLowerCase().includes('brute')) return 'Brute';
        if (a.name.toLowerCase().includes('better')) return 'Better';
        return 'Optimal';
      })
    : ['Brute', 'Better', 'Optimal'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header: back + title + difficulty + bookmark */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          #{problem.lcNumber}. {problem.title}
        </Text>
        <View style={[styles.diffBadge, { backgroundColor: diffColor + '20', borderColor: diffColor + '40' }]}>
          <Text style={[styles.diffText, { color: diffColor }]}>{problem.difficulty}</Text>
        </View>
        <Pressable onPress={handleBookmark} hitSlop={12}>
          <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
            <MaterialCommunityIcons name={bookmarked ? 'star' : 'star-outline'} size={24} color={bookmarked ? colors.yellow : colors.textDim} />
          </Animated.View>
        </Pressable>
      </View>

      {/* Question / Solution Toggle */}
      <View style={styles.toggleRow}>
        <Pressable
          style={[styles.toggleBtn, viewMode === 'question' && styles.toggleBtnActive]}
          onPress={() => { hapticLight(); setViewMode('question'); scrollRef.current?.scrollTo({ y: 0, animated: false }); }}
        >
          <MaterialCommunityIcons name="help-circle-outline" size={16} color={viewMode === 'question' ? colors.accent : colors.textDim} />
          <Text style={[styles.toggleText, viewMode === 'question' && styles.toggleTextActive]}>Question</Text>
        </Pressable>
        <Pressable
          style={[styles.toggleBtn, viewMode === 'solution' && styles.toggleBtnActive]}
          onPress={() => { hapticLight(); setViewMode('solution'); scrollRef.current?.scrollTo({ y: 0, animated: false }); }}
        >
          <MaterialCommunityIcons name="code-tags" size={16} color={viewMode === 'solution' ? colors.green : colors.textDim} />
          <Text style={[styles.toggleText, viewMode === 'solution' && styles.toggleTextActive]}>Solution</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        onTouchStart={mainSwipe.onTouchStart}
        onTouchEnd={mainSwipe.onTouchEnd}
      >
        {/* ============ QUESTION TAB ============ */}
        {viewMode === 'question' && (
          <View>
            <View style={styles.questionSection}>
              <Text style={styles.questionTitle}>Problem Description</Text>
              <Text style={styles.questionText}>
                {solution?.description || solution?.summary || 'Loading...'}
              </Text>
            </View>

            {solution && (
              <LinearGradient colors={[colors.accentDark + '30', 'transparent']} style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  <MaterialCommunityIcons name="lightbulb-outline" size={18} color={colors.yellow} />
                  <Text style={styles.insightLabel}>Key Insight (Hint)</Text>
                </View>
                <Text style={styles.insightText}>{solution.keyInsight}</Text>
              </LinearGradient>
            )}

            <View style={styles.metaSection}>
              <Text style={styles.metaTitle}>Details</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Topic</Text>
                <Text style={styles.metaValue}>{problem.topicId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Tags</Text>
                <View style={styles.tagRow}>
                  {problem.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {solution && (
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Best</Text>
                  <Text style={[styles.metaValue, { color: colors.green }]}>{solution.bestApproach}</Text>
                </View>
              )}
            </View>

            <Pressable style={styles.viewSolutionBtn} onPress={() => { hapticLight(); setViewMode('solution'); scrollRef.current?.scrollTo({ y: 0, animated: false }); }}>
              <Text style={styles.viewSolutionText}>Swipe left or tap for Solution →</Text>
            </Pressable>
          </View>
        )}

        {/* ============ SOLUTION TAB ============ */}
        {viewMode === 'solution' && (
          <View
            onTouchStart={approachSwipe.onTouchStart}
            onTouchEnd={approachSwipe.onTouchEnd}
          >
            {loading && <SkeletonLoader />}
            {error && (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.red} />
                <Text style={styles.errorText}>{error}</Text>
                <Pressable onPress={retry} style={styles.retryBtn}>
                  <Text style={styles.retryText}>Retry</Text>
                </Pressable>
              </View>
            )}
            {solution && (
              <Animated.View style={{ opacity: fadeIn }}>
                <AnimatedTabBar tabs={approachNames} activeIndex={activeApproach} onTabPress={setActiveApproach} />
                <Text style={styles.swipeHint}>← Swipe to switch approaches →</Text>
                {solution.approaches[activeApproach] && (
                  <ApproachCard key={activeApproach} approach={solution.approaches[activeApproach]} />
                )}
              </Animated.View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Bar — just Solve button */}
      <View style={styles.bottomBar}>
        <Pressable onPress={handleSolve} disabled={solved} style={[styles.solveBtn, solved && styles.solveBtnDone]}>
          {solved ? (
            <View style={styles.solveRow}>
              <MaterialCommunityIcons name="check-circle" size={18} color={colors.green} />
              <Text style={[styles.solveText, { color: colors.green }]}>Solved</Text>
            </View>
          ) : (
            <Text style={styles.solveText}>
              Mark Solved (+{problem.difficulty === 'Easy' ? 20 : problem.difficulty === 'Medium' ? 40 : 70} XP)
            </Text>
          )}
        </Pressable>
      </View>
      <XPToast xp={xpGained} visible={showXPToast} onDismiss={() => setShowXPToast(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: spacing.sm },
  headerTitle: { flex: 1, fontFamily: fonts.bodySemiBold, fontSize: fontSize.md, color: colors.text },
  diffBadge: { paddingHorizontal: spacing.sm + 2, paddingVertical: 3, borderRadius: radius.sm, borderWidth: 1 },
  diffText: { fontFamily: fonts.bodySemiBold, fontSize: 10, letterSpacing: 0.5 },
  scroll: { paddingBottom: 100 },

  toggleRow: { flexDirection: 'row', marginHorizontal: spacing.lg, marginBottom: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, padding: 4, gap: 4 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingVertical: spacing.sm + 2, borderRadius: radius.md },
  toggleBtnActive: { backgroundColor: colors.bg },
  toggleText: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.sm, color: colors.textDim },
  toggleTextActive: { color: colors.text },

  questionSection: { marginHorizontal: spacing.lg, marginBottom: spacing.lg, padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  questionTitle: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.sm, color: colors.blue, textTransform: 'uppercase', letterSpacing: 1 },
  questionText: { fontFamily: fonts.body, fontSize: fontSize.md, color: colors.text, lineHeight: 26 },

  metaSection: { marginHorizontal: spacing.lg, marginBottom: spacing.lg, padding: spacing.lg, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  metaTitle: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.sm, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metaLabel: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textMuted },
  metaValue: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.sm, color: colors.text },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  tag: { backgroundColor: colors.border, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.sm },
  tagText: { fontFamily: fonts.mono, fontSize: 10, color: colors.textMuted },

  viewSolutionBtn: { alignItems: 'center', marginHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.accentDark + '20', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.accent + '20' },
  viewSolutionText: { fontFamily: fonts.bodyMedium, fontSize: fontSize.sm, color: colors.accent },

  swipeHint: { fontFamily: fonts.body, fontSize: fontSize.xs, color: colors.textDim, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xs },

  insightCard: { marginHorizontal: spacing.lg, marginBottom: spacing.lg, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.accent + '30' },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  insightLabel: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.xs, color: colors.yellow, textTransform: 'uppercase', letterSpacing: 1 },
  insightText: { fontFamily: fonts.bodyMedium, fontSize: fontSize.md, color: colors.text, lineHeight: 22 },

  errorContainer: { alignItems: 'center', padding: spacing.xxl, gap: spacing.md },
  errorText: { fontFamily: fonts.body, fontSize: fontSize.md, color: colors.textMuted, textAlign: 'center' },
  retryBtn: { backgroundColor: colors.accent, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm + 2, borderRadius: radius.full },
  retryText: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.md, color: '#fff' },

  bottomBar: { padding: spacing.lg, paddingBottom: spacing.xl, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border },
  solveBtn: { backgroundColor: colors.accentDark, paddingVertical: spacing.md + 2, borderRadius: radius.lg, alignItems: 'center' },
  solveBtnDone: { backgroundColor: colors.greenDark + '40', borderWidth: 1, borderColor: colors.green + '40' },
  solveRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  solveText: { fontFamily: fonts.bodyBold, fontSize: fontSize.sm, color: '#fff' },
});
