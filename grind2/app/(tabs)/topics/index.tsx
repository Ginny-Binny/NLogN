import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../constants/colors';
import { fonts, fontSize, spacing } from '../../../constants/layout';
import { TOPICS } from '../../../constants/topics';
import { TopicCard } from '../../../components/TopicCard';
import { XPBar } from '../../../components/XPBar';
import { useProgress } from '../../../hooks/useProgress';

export default function TopicBrowser() {
  const router = useRouter();
  const { progress } = useProgress();

  const topicData = useMemo(
    () => TOPICS.map((t) => ({ ...t, solved: progress.topicProgress[t.id] || 0 })),
    [progress.topicProgress]
  );

  const totalSolved = progress.solvedIds.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>N<Text style={styles.titleRed}>Log</Text>N</Text>
          <Text style={styles.statText}>
            <Text style={styles.statHighlight}>{totalSolved}</Text> solved
          </Text>
        </View>
        <XPBar xp={progress.xp} />
      </View>
      <FlatList
        data={topicData}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TopicCard
            topic={item}
            solved={item.solved}
            index={index}
            onPress={() => router.push(`/(tabs)/topics/${item.id}`)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.lg, gap: spacing.md },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  title: { fontFamily: fonts.bodyBold, fontSize: fontSize.hero, color: colors.text, letterSpacing: 3 },
  titleRed: { color: colors.red },
  statText: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textMuted },
  statHighlight: { fontFamily: fonts.bodyBold, color: colors.accent },
  grid: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
});
