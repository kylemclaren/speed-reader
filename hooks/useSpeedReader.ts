import { useState, useCallback, useRef, useEffect } from 'react';
import { ParsedContent, getRecentContext } from '../utils/textParser';

export interface SpeedReaderState {
  isPlaying: boolean;
  currentIndex: number;
  wpm: number;
  content: ParsedContent | null;
}

export interface SpeedReaderControls {
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  next: () => void;
  previous: () => void;
  skipForward: (count?: number) => void;
  skipBackward: (count?: number) => void;
  setWpm: (wpm: number) => void;
  goToIndex: (index: number) => void;
  reset: () => void;
  setContent: (content: ParsedContent) => void;
}

export interface SpeedReaderInfo {
  currentWord: string;
  progress: number;
  wordsRemaining: number;
  timeRemaining: number; // in seconds
  recentContext: string[];
}

const DEFAULT_WPM = 300;
const MIN_WPM = 100;
const MAX_WPM = 1000;

export function useSpeedReader(): SpeedReaderState & SpeedReaderControls & SpeedReaderInfo {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wpm, setWpmState] = useState(DEFAULT_WPM);
  const [content, setContentState] = useState<ParsedContent | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate interval from WPM
  const getInterval = useCallback(() => {
    return Math.round(60000 / wpm);
  }, [wpm]);

  // Clear the interval
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start the timer
  const startTimer = useCallback(() => {
    clearTimer();
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        if (content && prev >= content.words.length - 1) {
          clearTimer();
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, getInterval());
  }, [clearTimer, getInterval, content]);

  // Play
  const play = useCallback(() => {
    if (!content || currentIndex >= content.words.length - 1) return;
    setIsPlaying(true);
    startTimer();
  }, [content, currentIndex, startTimer]);

  // Pause
  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  // Toggle
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  // Next word
  const next = useCallback(() => {
    if (!content) return;
    setCurrentIndex(prev => Math.min(prev + 1, content.words.length - 1));
  }, [content]);

  // Previous word
  const previous = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  // Skip forward
  const skipForward = useCallback((count: number = 10) => {
    if (!content) return;
    setCurrentIndex(prev => Math.min(prev + count, content.words.length - 1));
  }, [content]);

  // Skip backward
  const skipBackward = useCallback((count: number = 10) => {
    setCurrentIndex(prev => Math.max(prev - count, 0));
  }, []);

  // Set WPM
  const setWpm = useCallback((newWpm: number) => {
    const clampedWpm = Math.max(MIN_WPM, Math.min(MAX_WPM, newWpm));
    setWpmState(clampedWpm);
  }, []);

  // Go to specific index
  const goToIndex = useCallback((index: number) => {
    if (!content) return;
    setCurrentIndex(Math.max(0, Math.min(index, content.words.length - 1)));
  }, [content]);

  // Reset
  const reset = useCallback(() => {
    pause();
    setCurrentIndex(0);
  }, [pause]);

  // Set content
  const setContent = useCallback((newContent: ParsedContent) => {
    pause();
    setCurrentIndex(0);
    setContentState(newContent);
  }, [pause]);

  // Restart timer when WPM changes during playback
  useEffect(() => {
    if (isPlaying) {
      startTimer();
    }
    return clearTimer;
  }, [wpm, isPlaying, startTimer, clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  // Computed values
  const currentWord = content?.words[currentIndex] || '';
  const progress = content ? (currentIndex / content.words.length) * 100 : 0;
  const wordsRemaining = content ? content.words.length - currentIndex - 1 : 0;
  const timeRemaining = wordsRemaining * (60 / wpm);
  const recentContext = content
    ? getRecentContext(currentIndex, content.words, content.sentences, 2)
    : [];

  return {
    // State
    isPlaying,
    currentIndex,
    wpm,
    content,
    // Controls
    play,
    pause,
    togglePlayPause,
    next,
    previous,
    skipForward,
    skipBackward,
    setWpm,
    goToIndex,
    reset,
    setContent,
    // Info
    currentWord,
    progress,
    wordsRemaining,
    timeRemaining,
    recentContext,
  };
}
