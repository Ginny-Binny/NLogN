import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Approach } from '../types';
import { colors } from '../constants/colors';
import { fonts, fontSize, spacing } from '../constants/layout';
import { ComplexityBadge } from './ComplexityBadge';
import { CodeBlock } from './CodeBlock';

type Props = { approach: Approach };

export function ApproachCard({ approach }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  }, [approach]);

  return (
    <Animated.View style={[styles.container, { opacity: fade }]}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Intuition</Text>
        <Text style={styles.bodyText}>{approach.intuition}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Complexity</Text>
        <View style={styles.badgeRow}>
          <ComplexityBadge complexity={approach.timeComplexity} type="time" />
          <ComplexityBadge complexity={approach.spaceComplexity} type="space" />
        </View>
        <View style={styles.complexityDetails}>
          <Text style={styles.complexityText}><Text style={styles.complexityLabel}>Time: </Text>{approach.timeComplexity}</Text>
          <Text style={styles.complexityText}><Text style={styles.complexityLabel}>Space: </Text>{approach.spaceComplexity}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tradeoffs</Text>
        <Text style={styles.bodyText}>{approach.tradeoffs}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Code</Text>
        <CodeBlock code={approach.code} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.xl },
  section: { gap: spacing.sm },
  sectionTitle: { fontFamily: fonts.bodySemiBold, fontSize: fontSize.sm, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  bodyText: { fontFamily: fonts.body, fontSize: fontSize.md, color: colors.text, lineHeight: 22 },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  complexityDetails: { gap: spacing.xs, marginTop: spacing.xs },
  complexityText: { fontFamily: fonts.body, fontSize: fontSize.sm, color: colors.textMuted },
  complexityLabel: { fontFamily: fonts.bodySemiBold, color: colors.text },
});
