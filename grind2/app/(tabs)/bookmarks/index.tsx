import React, { useMemo, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../constants/colors';
import { fonts, fontSize, spacing } from '../../../constants/layout';
import { PROBLEMS } from '../../../data/problems';
import { ProblemCard } from '../../../components/ProblemCard';
import { EmptyState } from '../../../components/EmptyState';
import { useProgress } from '../../../hooks/useProgress';

export default function Bookmarks() {
  const router = useRouter();
  const { progress, isSolved, isBookmarked, toggleBookmark } = useProgress();

  const bookmarkedProblems = useMemo(
    () => PROBLEMS.filter((p) => progress.bookmarkedIds.includes(p.id)),
    [progress.bookmarkedIds]
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookmarks</Text>
        {bookmarkedProblems.length > 0 && (
          <Text style={styles.count}>{bookmarkedProblems.length}</Text>
        )}
      </View>
      {bookmarkedProblems.length === 0 ? (
        <EmptyState icon="star-outline" title="No bookmarks yet" subtitle="Star problems to save them here for quick access." />
      ) : (
        <FlatList
          data={bookmarkedProblems}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item, index }) => (
            <ProblemCard
              problem={item}
              index={index}
              isSolved={isSolved(item.id)}
              isBookmarked={isBookmarked(item.id)}
              onPress={() => router.push(`/problem/${item.id}`)}
              onBookmark={() => toggleBookmark(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'baseline', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md, gap: spacing.md },
  title: { fontFamily: fonts.bodyBold, fontSize: fontSize.xxl, color: colors.text },
  count: { fontFamily: fonts.mono, fontSize: fontSize.md, color: colors.textMuted },
  list: { paddingBottom: spacing.xxl },
});
