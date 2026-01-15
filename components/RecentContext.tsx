import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
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
        <ScrollView
          style={styles.contextContainer}
          contentContainerStyle={styles.contextContent}
          showsVerticalScrollIndicator={false}
        >
          {sentences.map((sentence, index) => {
            const isCurrentSentence = index === sentences.length - 1;
            const opacity = isCurrentSentence ? 1 : 0.5 + (index / sentences.length) * 0.3;

            return (
              <View
                key={index}
                style={[
                  styles.sentenceRow,
                  isCurrentSentence && styles.currentSentenceRow,
                ]}
              >
                <Text
                  style={[
                    styles.sentenceText,
                    isCurrentSentence && styles.currentSentenceText,
                    { opacity },
                  ]}
                >
                  {sentence}
                </Text>
              </View>
            );
          })}
        </ScrollView>
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
    maxHeight: 180,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  contextContent: {
    overflow: 'hidden',
    borderRadius: theme.borderRadius.md,
  },
  sentenceRow: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  currentSentenceRow: {
    backgroundColor: theme.colors.surfaceLight,
    borderLeftColor: theme.colors.accent,
  },
  sentenceText: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    lineHeight: 22,
  },
  currentSentenceText: {
    color: theme.colors.text,
    fontWeight: '500',
  },
});
