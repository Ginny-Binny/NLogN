import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, difficultyColors } from '../constants/colors';
import { fonts, fontSize, spacing, radius } from '../constants/layout';
import { hapticLight } from '../lib/haptics';

type Filter = 'All' | 'Easy' | 'Medium' | 'Hard';
type Props = { active: Filter; onSelect: (f: Filter) => void };

const FILTERS: Filter[] = ['All', 'Easy', 'Medium', 'Hard'];

export function FilterPills({ active, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {FILTERS.map((f) => {
        const isActive = active === f;
        const pillColor = f === 'All' ? colors.accent : difficultyColors[f] || colors.accent;
        return (
          <Pressable key={f} onPress={() => { hapticLight(); onSelect(f); }}>
            <View style={[styles.pill, { backgroundColor: isActive ? pillColor + '25' : 'transparent', borderColor: isActive ? pillColor : colors.border }]}>
              <Text style={[styles.pillText, { color: isActive ? pillColor : colors.textMuted }]}>{f}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  pill: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1 },
  pillText: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.sm },
});
