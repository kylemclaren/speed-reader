import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useArticleExtractor } from '../hooks/useArticleExtractor';

export default function HomeScreen() {
  const [url, setUrl] = useState('');
  const router = useRouter();
  const { isLoading, error, extractFromUrl, clearError } = useArticleExtractor();

  const handleSubmit = async () => {
    if (!url.trim()) return;

    clearError();
    const content = await extractFromUrl(url.trim());

    if (content) {
      router.push({
        pathname: '/reader',
        params: {
          content: JSON.stringify(content),
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Speed Reader</Text>
            <Text style={styles.subtitle}>
              Read any article at lightning speed
            </Text>
          </View>

          {/* URL Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Feather
                name="link"
                size={20}
                color={theme.colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Paste article URL..."
                placeholderTextColor={theme.colors.textMuted}
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
                editable={!isLoading}
              />
              {url.length > 0 && (
                <Pressable onPress={() => setUrl('')} style={styles.clearButton}>
                  <Feather name="x" size={18} color={theme.colors.textMuted} />
                </Pressable>
              )}
            </View>

            {/* Error message */}
            {error && (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={16} color={theme.colors.accent} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Submit button */}
            <Pressable
              onPress={handleSubmit}
              disabled={isLoading || !url.trim()}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                (!url.trim() || isLoading) && styles.buttonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.background} />
              ) : (
                <>
                  <Text style={styles.buttonText}>Start Reading</Text>
                  <Feather name="arrow-right" size={20} color={theme.colors.background} />
                </>
              )}
            </Pressable>
          </View>

          {/* Tips */}
          <View style={styles.tips}>
            <Text style={styles.tipTitle}>Tips</Text>
            <Text style={styles.tipText}>
              Works best with news articles, blog posts, and long-form content.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  inputContainer: {
    gap: theme.spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.accent,
    fontSize: theme.fontSize.sm,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.control,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  buttonPressed: {
    backgroundColor: theme.colors.controlDark,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.background,
  },
  tips: {
    marginTop: theme.spacing.xxl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  tipTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  tipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
    lineHeight: 20,
  },
});
