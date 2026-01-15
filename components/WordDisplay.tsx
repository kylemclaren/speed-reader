import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { splitAtFocal } from '../utils/focalLetter';
import { theme } from '../constants/theme';

interface WordDisplayProps {
  word: string;
}

export function WordDisplay({ word }: WordDisplayProps) {
  const { before, focal, after } = splitAtFocal(word);

  return (
    <View style={styles.container}>
      {/* Guide lines */}
      <View style={styles.guideContainer}>
        <View style={styles.guideLine} />
        <View style={styles.centerMark} />
        <View style={styles.guideLine} />
      </View>

      {/* Word display */}
      <View style={styles.wordContainer}>
        <Text style={styles.wordText}>
          <Text style={styles.normalText}>{before}</Text>
          <Text style={styles.focalText}>{focal}</Text>
          <Text style={styles.normalText}>{after}</Text>
        </Text>
      </View>

      {/* Bottom guide lines */}
      <View style={styles.guideContainer}>
        <View style={styles.guideLine} />
        <View style={styles.centerMark} />
        <View style={styles.guideLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  guideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
  },
  guideLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  centerMark: {
    width: 1,
    height: 12,
    backgroundColor: theme.colors.border,
    marginHorizontal: 2,
  },
  wordContainer: {
    paddingVertical: theme.spacing.xxl,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordText: {
    fontSize: theme.fontSize.word,
    fontWeight: '400',
    letterSpacing: 2,
  },
  normalText: {
    color: theme.colors.text,
  },
  focalText: {
    color: theme.colors.accent,
  },
});
