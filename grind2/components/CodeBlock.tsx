import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { colors } from '../constants/colors';
import { fonts, fontSize, spacing, radius } from '../constants/layout';
import { hapticLight } from '../lib/haptics';

type Props = { code: string };

export function CodeBlock({ code }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(code);
    hapticLight();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <View style={styles.container}>
      <Pressable onPress={handleCopy} style={styles.copyBtn}>
        <MaterialCommunityIcons name={copied ? 'check' : 'content-copy'} size={16} color={copied ? colors.green : colors.textMuted} />
      </Pressable>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
          <Text style={styles.code}>{code}</Text>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.codeBg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, position: 'relative' },
  copyBtn: { position: 'absolute', top: spacing.sm, right: spacing.sm, zIndex: 10, padding: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.sm },
  code: { fontFamily: fonts.mono, fontSize: fontSize.sm, color: colors.text, lineHeight: 20 },
});
