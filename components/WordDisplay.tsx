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
        <View style={styles.guideLineLeft} />
        <View style={styles.centerMark} />
        <View style={styles.guideLineRight} />
      </View>

      {/* Word display - focal letter anchored to center */}
      <View style={styles.wordContainer}>
        <View style={styles.wordRow}>
          {/* Before: right-aligned, fixed width */}
          <View style={styles.beforeContainer}>
            <Text style={[styles.wordText, styles.normalText, styles.beforeText]}>
              {before}
            </Text>
          </View>
          {/* Focal letter: fixed position */}
          <Text style={[styles.wordText, styles.focalText]}>{focal}</Text>
          {/* After: left-aligned, fixed width */}
          <View style={styles.afterContainer}>
            <Text style={[styles.wordText, styles.normalText, styles.afterText]}>
              {after}
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom guide lines */}
      <View style={styles.guideContainer}>
        <View style={styles.guideLineLeft} />
        <View style={styles.centerMark} />
        <View style={styles.guideLineRight} />
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
  guideLineLeft: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  guideLineRight: {
    flex: 2,
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
    width: '100%',
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
  },
  beforeContainer: {
    width: '33%',
    alignItems: 'flex-end',
  },
  afterContainer: {
    width: '62%',
    alignItems: 'flex-start',
  },
  beforeText: {
    textAlign: 'right',
  },
  afterText: {
    textAlign: 'left',
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
