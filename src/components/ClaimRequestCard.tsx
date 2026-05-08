import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ShieldCheck, ShieldX, UserRound } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { FontFamily } from '../theme/typography';
import { Radius, Spacing } from '../theme/tokens';
import type { ClaimRequestStatus } from '../types';

interface ClaimRequestCardProps {
  title: string;
  subtitle: string;
  status: ClaimRequestStatus;
  requesterName?: string;
  requesterEmail?: string;
  canReview?: boolean;
  loading?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onPress?: () => void;
}

const STATUS_STYLE: Record<ClaimRequestStatus, { bg: string; text: string; label: string }> = {
  PENDING: { bg: Colors.muted, text: Colors.textSecondary, label: 'PENDING' },
  APPROVED: { bg: Colors.successSoft, text: Colors.success, label: 'APPROVED' },
  REJECTED: { bg: Colors.errorSoft, text: Colors.error, label: 'REJECTED' },
};

export default function ClaimRequestCard({
  title,
  subtitle,
  status,
  requesterName,
  requesterEmail,
  canReview,
  loading,
  onApprove,
  onReject,
  onPress,
}: ClaimRequestCardProps) {
  const statusStyle = STATUS_STYLE[status];
  const verified = requesterEmail?.toLowerCase().endsWith('@feuroosevelt.edu.ph');

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.82 : 1}
      onPress={onPress}
      disabled={!onPress}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <View style={[styles.statusChip, { backgroundColor: statusStyle.bg }]}> 
          <Text style={[styles.statusText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>{subtitle}</Text>

      {requesterName ? (
        <View style={styles.requesterRow}>
          <UserRound size={14} color={Colors.primary} />
          <Text style={styles.requesterName} numberOfLines={1}>{requesterName}</Text>
          {verified ? <Text style={styles.verified}>Verified</Text> : null}
        </View>
      ) : null}

      {canReview && status === 'PENDING' ? (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton, loading && styles.actionDisabled]}
            onPress={onReject}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? <ActivityIndicator color={Colors.error} size="small" /> : <ShieldX size={16} color={Colors.error} />}
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton, loading && styles.actionDisabled]}
            onPress={onApprove}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? <ActivityIndicator color={Colors.success} size="small" /> : <ShieldCheck size={16} color={Colors.success} />}
            <Text style={styles.approveText}>Approve</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm + 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    fontFamily: FontFamily.displaySemiBold,
  },
  statusChip: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 1,
  },
  statusText: {
    fontSize: 10,
    fontFamily: FontFamily.bodyBold,
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: Spacing.xs + 1,
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: FontFamily.bodySemiBold,
  },
  requesterRow: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  requesterName: {
    flex: 1,
    fontSize: 12,
    color: Colors.primary,
    fontFamily: FontFamily.bodyBold,
  },
  verified: {
    fontSize: 10,
    color: Colors.success,
    fontFamily: FontFamily.bodyBold,
  },
  actionsRow: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    height: 42,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs + 1,
  },
  rejectButton: {
    backgroundColor: Colors.errorSoft,
  },
  approveButton: {
    backgroundColor: Colors.successSoft,
  },
  rejectText: {
    fontSize: 13,
    color: Colors.error,
    fontFamily: FontFamily.bodyBold,
  },
  approveText: {
    fontSize: 13,
    color: Colors.success,
    fontFamily: FontFamily.bodyBold,
  },
  actionDisabled: {
    opacity: 0.6,
  },
});
