import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Colors } from '../theme/colors';
import { FontFamily } from '../theme/typography';
import { Spacing } from '../theme/tokens';

interface LoadingStateProps {
  message?: string;
  style?: ViewStyle;
}

export default function LoadingState({
  message = 'Loading... please wait',
  style,
}: LoadingStateProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.md,
  },
  text: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: FontFamily.bodySemiBold,
    textAlign: 'center',
  },
});
