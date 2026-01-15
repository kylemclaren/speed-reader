import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import { Feather } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface SpeedControlProps {
  wpm: number;
  onWpmChange: (wpm: number) => void;
  minWpm?: number;
  maxWpm?: number;
}

export function SpeedControl({
  wpm,
  onWpmChange,
  minWpm = 100,
  maxWpm = 1000,
}: SpeedControlProps) {
  const stepSize = 50;

  const decreaseWpm = () => {
    onWpmChange(Math.max(minWpm, wpm - stepSize));
  };

  const increaseWpm = () => {
    onWpmChange(Math.min(maxWpm, wpm + stepSize));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.wpmLabel}>{wpm} WPM</Text>

      <View style={styles.sliderRow}>
        <Pressable
          onPress={decreaseWpm}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Feather name="minus" size={24} color={theme.colors.text} />
        </Pressable>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={minWpm}
            maximumValue={maxWpm}
            step={10}
            value={wpm}
            onValueChange={onWpmChange}
            minimumTrackTintColor={theme.colors.control}
            maximumTrackTintColor={theme.colors.surface}
            thumbTintColor={theme.colors.text}
          />
        </View>

        <Pressable
          onPress={increaseWpm}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
        >
          <Feather name="plus" size={24} color={theme.colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  wpmLabel: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: theme.colors.surfaceLight,
  },
  sliderContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.md,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
