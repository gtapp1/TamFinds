import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { FontFamily } from '../theme/typography';
import { Radius, Spacing } from '../theme/tokens';

interface ErrorStateProps {
  message: string;
  title?: string;
  compact?: boolean;
  onRetry?: () => void;
  style?: ViewStyle;
}

export default function ErrorState({
  message,
  title = 'Something went wrong',
  compact = false,
  onRetry,
  style,
}: ErrorStateProps) {
  if (compact) {
    return (
      <View style={[styles.compactContainer, style]}>
        <AlertCircle size={15} color={Colors.error} />
        <Text style={styles.compactText}>{message}</Text>
        {onRetry ? (
          <TouchableOpacity onPress={onRetry} style={styles.retryInline} activeOpacity={0.8}>
            <RefreshCw size={14} color={Colors.error} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <AlertCircle size={28} color={Colors.error} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.86}>
          <RefreshCw size={16} color={Colors.surface} />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.errorSoft,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  compactText: {
    flex: 1,
    color: Colors.error,
    fontSize: 13,
    fontFamily: FontFamily.bodySemiBold,
  },
  retryInline: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl + Spacing.xs,
    paddingVertical: Spacing.xxl * 2,
  },
  title: {
    marginTop: Spacing.md,
    fontSize: 20,
    color: Colors.primary,
    fontFamily: FontFamily.displaySemiBold,
    textAlign: 'center',
  },
  message: {
    marginTop: Spacing.sm,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    fontFamily: FontFamily.bodySemiBold,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.lg,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  retryText: {
    fontSize: 14,
    color: Colors.surface,
    fontFamily: FontFamily.bodyBold,
  },
});
