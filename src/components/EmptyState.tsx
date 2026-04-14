import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import { Plus } from 'lucide-react-native';
import TamarawBadge from './TamarawBadge';
import { Colors } from '../theme/colors';
import { FontFamily } from '../theme/typography';
import { Radius, Shadow, Spacing } from '../theme/tokens';

type BadgeVariant = 'neutral' | 'lost' | 'found' | 'claimed' | 'search';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  variant?: BadgeVariant;
  label?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export default function EmptyState({
  title,
  subtitle,
  variant = 'neutral',
  label = 'TAM',
  icon,
  actionLabel,
  onActionPress,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      {icon ?? <TamarawBadge size={88} variant={variant} label={label} />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {actionLabel && onActionPress ? (
        <TouchableOpacity style={styles.actionButton} onPress={onActionPress} activeOpacity={0.86}>
          <Plus color={Colors.primary} size={20} strokeWidth={2.6} />
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl + Spacing.xs,
    paddingVertical: Spacing.xxl * 2,
  },
  title: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
    fontSize: 22,
    color: Colors.primary,
    fontFamily: FontFamily.displayBold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    fontFamily: FontFamily.bodySemiBold,
    textAlign: 'center',
  },
  actionButton: {
    marginTop: Spacing.xl,
    height: 50,
    borderRadius: Radius.md,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadow.card,
  },
  actionText: {
    fontSize: 15,
    color: Colors.primary,
    fontFamily: FontFamily.displaySemiBold,
  },
});
