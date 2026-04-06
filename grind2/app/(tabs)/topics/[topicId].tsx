import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../constants/colors';
import { fonts, fontSize, spacing } from '../../../constants/layout';
import { getTopicById } from '../../../constants/topics';
import { getProblemsByTopic } from '../../../data/problems';
import { ProblemCard } from '../../../components/ProblemCard';
import { FilterPills } from '../../../components/FilterPills';
import { useProgress } from '../../../hooks/useProgress';

type Filter = 'All' | 'Easy' | 'Medium' | 'Hard';

export default function ProblemList() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  const router = useRouter();
  const { isSolved, isBookmarked, toggleBookmark } = useProgress();
  const [filter, setFilter] = useState<Filter>('All');

  const topic = getTopicById(topicId || '');
  const allProblems = useMemo(() => getProblemsByTopic(topicId || ''), [topicId]);
  const filteredProblems = useMemo(
    () => filter === 'All' ? allProblems : allProblems.filter((p) => p.difficulty === filter),
    [allProblems, filter]
  );

  if (!topic) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <MaterialCommunityIcons name={topic.icon as any} size={20} color={topic.accentColor} />
          <Text style={styles.headerTitle}>{topic.displayName}</Text>
        </View>
        <Text style={styles.countText}>{allProblems.length}</Text>
      </View>
      <FilterPills active={filter} onSelect={(f) => setFilter(f)} />
      <FlatList
        key={filter}
        data={filteredProblems}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.md },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  headerTitle: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.lg, color: colors.text },
  countText: { fontFamily: fonts.mono, fontSize: fontSize.sm, color: colors.textMuted },
  list: { paddingBottom: spacing.xxl },
});
