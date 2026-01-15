import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface ProgressBarProps {
  currentWord: number;
  totalWords: number;
  progress: number;
}

export function ProgressBar({ currentWord, totalWords, progress }: ProgressBarProps) {
  const percentage = Math.round(progress);

  return (
    <View style={styles.container}>
      <Text style={styles.statsText}>
        {currentWord} / {totalWords} words ({percentage}%)
      </Text>

      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  statsText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  barContainer: {
    height: 4,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: theme.colors.control,
    borderRadius: theme.borderRadius.full,
  },
});
