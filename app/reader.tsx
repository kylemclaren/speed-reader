import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useSpeedReader } from '../hooks/useSpeedReader';
import {
  WordDisplay,
  ProgressBar,
  SpeedControl,
  PlaybackControls,
  RecentContext,
} from '../components';
import { ParsedContent } from '../utils/textParser';

export default function ReaderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ content: string }>();

  const {
    isPlaying,
    currentIndex,
    wpm,
    content,
    currentWord,
    progress,
    recentContext,
    setContent,
    togglePlayPause,
    next,
    previous,
    skipForward,
    skipBackward,
    setWpm,
  } = useSpeedReader();

  // Parse and set content on mount
  useEffect(() => {
    if (params.content) {
      try {
        const parsedContent: ParsedContent = JSON.parse(params.content);
        setContent(parsedContent);
      } catch (e) {
        console.error('Failed to parse content:', e);
        router.back();
      }
    }
  }, [params.content, setContent, router]);

  if (!content) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.headerButtonPressed,
          ]}
        >
          <Feather name="chevron-left" size={24} color={theme.colors.text} />
        </Pressable>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {content.title}
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.headerButton,
            pressed && styles.headerButtonPressed,
          ]}
        >
          <Feather name="more-horizontal" size={24} color={theme.colors.text} />
        </Pressable>
      </View>

      {/* Main content area */}
      <View style={styles.mainContent}>
        {/* Word display */}
        <WordDisplay word={currentWord} />

        {/* Progress */}
        <ProgressBar
          currentWord={currentIndex + 1}
          totalWords={content.wordCount}
          progress={progress}
        />

        {/* Recent context */}
        <RecentContext sentences={recentContext} />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <SpeedControl wpm={wpm} onWpmChange={setWpm} />

        <PlaybackControls
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onPrevious={previous}
          onNext={next}
          onSkipBackward={() => skipBackward(10)}
          onSkipForward={() => skipForward(10)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonPressed: {
    backgroundColor: theme.colors.surfaceLight,
  },
  headerTitleContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  headerTitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  controls: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: theme.spacing.md,
  },
});
