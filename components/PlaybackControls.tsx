import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
}

export function PlaybackControls({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  onSkipBackward,
  onSkipForward,
}: PlaybackControlsProps) {
  return (
    <View style={styles.container}>
      {/* Skip backward 10 */}
      <Pressable
        onPress={onSkipBackward}
        style={({ pressed }) => [
          styles.smallButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <View style={styles.skipButtonContent}>
          <Feather name="rotate-ccw" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.skipText}>10</Text>
        </View>
      </Pressable>

      {/* Previous */}
      <Pressable
        onPress={onPrevious}
        style={({ pressed }) => [
          styles.navButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Feather name="chevron-left" size={32} color={theme.colors.textSecondary} />
      </Pressable>

      {/* Play/Pause */}
      <Pressable
        onPress={onPlayPause}
        style={({ pressed }) => [
          styles.playButton,
          pressed && styles.playButtonPressed,
        ]}
      >
        <Feather
          name={isPlaying ? 'pause' : 'play'}
          size={32}
          color={theme.colors.background}
          style={!isPlaying && styles.playIcon}
        />
      </Pressable>

      {/* Next */}
      <Pressable
        onPress={onNext}
        style={({ pressed }) => [
          styles.navButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Feather name="chevron-right" size={32} color={theme.colors.textSecondary} />
      </Pressable>

      {/* Skip forward 10 */}
      <Pressable
        onPress={onSkipForward}
        style={({ pressed }) => [
          styles.smallButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <View style={styles.skipButtonContent}>
          <Feather name="rotate-cw" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.skipText}>10</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  smallButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: -2,
  },
  navButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.control,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.md,
  },
  playButtonPressed: {
    backgroundColor: theme.colors.controlDark,
  },
  playIcon: {
    marginLeft: 4, // Offset play icon for visual centering
  },
  buttonPressed: {
    opacity: 0.6,
  },
});
