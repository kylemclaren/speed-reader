import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface RecentContextProps {
  sentences: string[];
}

export function RecentContext({ sentences }: RecentContextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (sentences.length === 0) return null;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Feather
          name="align-left"
          size={16}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.buttonText}>Recent Context</Text>
        <Feather
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={theme.colors.textSecondary}
        />
      </Pressable>

      {isExpanded && (
        <View style={styles.contextContainer}>
          {sentences.map((sentence, index) => (
            <Text
              key={index}
              style={[
                styles.sentenceText,
                index === sentences.length - 1 && styles.currentSentence,
              ]}
            >
              {sentence}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'center',
    gap: theme.spacing.sm,
  },
  buttonPressed: {
    backgroundColor: theme.colors.surfaceLight,
  },
  buttonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
  },
  contextContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  sentenceText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },
  currentSentence: {
    color: theme.colors.textSecondary,
  },
});
