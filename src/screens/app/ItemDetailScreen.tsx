import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import {
  MapPin,
  Clock,
  Shield,
  Mail,
  CheckCircle,
  Tag,
  User,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { useItemDetail } from '../../hooks/useItemDetail';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { Radius, Shadow, Spacing } from '../../theme/tokens';
import { ItemDetailSkeleton } from '../../components/Skeleton';
import TamarawBadge from '../../components/TamarawBadge';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import type { ItemStatus } from '../../types';

type Props = NativeStackScreenProps<AppStackParamList, 'ItemDetail'>;

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ItemStatus, { bg: string; text: string; label: string; variant: 'lost' | 'found' | 'claimed' }> = {
  LOST:    { bg: Colors.errorSoft, text: Colors.error,         label: 'LOST',    variant: 'lost' },
  FOUND:   { bg: Colors.successSoft, text: Colors.success,       label: 'FOUND',   variant: 'found' },
  CLAIMED: { bg: Colors.muted, text: Colors.textSecondary, label: 'CLAIMED', variant: 'claimed' },
};

// ─── Relative time ────────────────────────────────────────────────────────────

function relativeTime(seconds: number): string {
  const diff = Math.floor(Date.now() / 1000) - seconds;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  const days = Math.floor(diff / 86400);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
}

// ─── Row helper ───────────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ItemDetailScreen({ route }: Props) {
  const { itemId } = route.params;
  const {
    item,
    reporter,
    loading,
    error,
    isOwner,
    claiming,
    requestingClaim,
    pendingRequests,
    hasRequested,
    markAsClaimed,
    requestClaim,
    approveRequest,
    rejectRequest,
  } = useItemDetail(itemId);

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: Spacing.xxl + Spacing.xs }}>
        <ItemDetailSkeleton />
      </ScrollView>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────

  if (!item) {
    return (
      <EmptyState
        title="Item no longer exists"
        subtitle="It may have been removed."
        variant="neutral"
        label="TAM"
        style={styles.centered}
      />
    );
  }

  const badge = STATUS_CONFIG[item.status];
  const timeAgo = item.reportedAt?.seconds ? relativeTime(item.reportedAt.seconds) : '';

  // ── Contact owner ──────────────────────────────────────────────────────────

  const handleContact = () => {
    if (!reporter?.email) return;
    const subject = encodeURIComponent(`TamFinds: Re "${item.title}"`);
    const body = encodeURIComponent(
      `Hi ${reporter.displayName},\n\nI saw your post on TamFinds about "${item.title}".\n\n`,
    );
    Linking.openURL(`mailto:${reporter.email}?subject=${subject}&body=${body}`).catch(() =>
      Alert.alert('Cannot open mail', 'No email app found on this device.'),
    );
  };

  const handleFoundThis = () => {
    if (!reporter?.email) return;
    const subject = encodeURIComponent(`TamFinds: I found your item "${item.title}"`);
    const body = encodeURIComponent(
      `Hi ${reporter.displayName},\n\nI found an item that may match your lost post: "${item.title}".\n\nYou can reply here so we can coordinate safely.\n\n`,
    );
    Linking.openURL(`mailto:${reporter.email}?subject=${subject}&body=${body}`).catch(() =>
      Alert.alert('Cannot open mail', 'No email app found on this device.'),
    );
  };

  // ── Mark as claimed ────────────────────────────────────────────────────────

  const handleClaim = () => {
    Alert.alert(
      'Mark as Claimed?',
      'This will update the item status to CLAIMED and let others know it has been resolved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark Claimed', style: 'default', onPress: markAsClaimed },
      ],
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero image ── */}
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.heroImage} />
      ) : (
        <View style={styles.heroPlaceholder}>
          <TamarawBadge size={82} variant={badge.variant} label={badge.label} />
          <Text style={styles.heroPlaceholderText}>No photo uploaded</Text>
        </View>
      )}

      {/* ── Status bar ── */}
      <View style={[styles.statusBar, { backgroundColor: badge.bg }]}>
        <TamarawBadge size={56} variant={badge.variant} label={badge.label} />
        {item.isAtSecurity && (
          <View style={styles.securityPill}>
            <Shield size={12} color={Colors.primary} strokeWidth={2.5} />
            <Text style={styles.securityPillText}>At Security Office</Text>
          </View>
        )}
      </View>

      {/* ── Main card ── */}
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.title}>{item.title}</Text>

        {/* Description */}
        {item.description ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : (
          <Text style={styles.descriptionEmpty}>No description provided.</Text>
        )}

        <View style={styles.divider} />

        {/* Info rows */}
        <InfoRow
          icon={<MapPin size={16} color={Colors.primary} strokeWidth={2} />}
          label="Location"
          value={item.location}
        />
        <InfoRow
          icon={<Tag size={16} color={Colors.primary} strokeWidth={2} />}
          label="Category"
          value={item.category}
        />
        <InfoRow
          icon={<Clock size={16} color={Colors.primary} strokeWidth={2} />}
          label="Reported"
          value={timeAgo}
        />
      </View>

      {/* ── Error banner ── */}
      {error ? (
        <ErrorState compact message={error} style={styles.errorBanner} />
      ) : null}

      {/* ── Reporter card ── */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>REPORTED BY</Text>
        <View style={styles.reporterRow}>
          <View style={styles.avatar}>
            <User size={20} color={Colors.primary} strokeWidth={2} />
          </View>
          <View style={styles.reporterInfo}>
            <Text style={styles.reporterName}>
              {reporter?.displayName ?? 'Loading…'}
            </Text>
            {reporter?.isSchoolVerified && (
              <Text style={styles.verifiedBadge}>✓ FEU Roosevelt Verified</Text>
            )}
          </View>
        </View>
      </View>

      {/* ── Actions ── */}
      <View style={styles.actionsGroup}>

        {/* Contact reporter — hidden from the reporter themselves */}
        {!isOwner && reporter?.email && item.status !== 'CLAIMED' && (
          <TouchableOpacity style={styles.contactButton} onPress={handleContact} activeOpacity={0.9}>
            <Mail size={18} color={Colors.primary} strokeWidth={2.5} />
            <Text style={styles.contactButtonText}>Contact Reporter</Text>
          </TouchableOpacity>
        )}

        {!isOwner && item.status === 'FOUND' && (
          <View style={styles.requestBlock}>
            <TouchableOpacity
              style={[styles.requestButton, (requestingClaim || hasRequested) && styles.buttonDisabled]}
              onPress={requestClaim}
              disabled={requestingClaim || hasRequested}
              activeOpacity={0.9}
            >
              {requestingClaim ? (
                <ActivityIndicator color={Colors.surface} size="small" />
              ) : (
                <>
                  <Shield size={17} color={Colors.surface} strokeWidth={2.4} />
                  <Text style={styles.requestButtonText}>
                    {hasRequested ? 'Claim Request Sent' : 'Request Claim'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
            {hasRequested ? (
              <Text style={styles.requestHint}>Your claim request is pending owner review.</Text>
            ) : (
              <Text style={styles.requestHint}>Submit once and wait for owner approval.</Text>
            )}
          </View>
        )}

        {!isOwner && item.status === 'LOST' && reporter?.email && (
          <View style={styles.requestBlock}>
            <TouchableOpacity
              style={styles.requestButton}
              onPress={handleFoundThis}
              activeOpacity={0.9}
            >
              <Mail size={17} color={Colors.surface} strokeWidth={2.4} />
              <Text style={styles.requestButtonText}>I Found This Item</Text>
            </TouchableOpacity>
            <Text style={styles.requestHint}>Message the owner directly so they can verify details.</Text>
          </View>
        )}

        {isOwner && item.status === 'FOUND' && pendingRequests.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>PENDING CLAIM REQUESTS</Text>
            {pendingRequests.map((req) => (
              <View key={req.id} style={styles.requestRow}>
                <View style={styles.requestInfo}>
                  <Text style={styles.requestName}>{req.requesterName}</Text>
                  <Text style={styles.requestEmail} numberOfLines={1}>{req.requesterEmail}</Text>
                  <Text style={styles.requestMeta}>
                    Requested {req.createdAt?.seconds ? relativeTime(req.createdAt.seconds) : 'just now'}
                  </Text>
                </View>
                <View style={styles.requestActionsCol}>
                  <TouchableOpacity
                    style={[styles.approveButton, claiming && styles.buttonDisabled]}
                    onPress={() => approveRequest(req.id, req.requesterId)}
                    activeOpacity={0.9}
                    disabled={claiming}
                  >
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.rejectButton, claiming && styles.buttonDisabled]}
                    onPress={() => rejectRequest(req.id)}
                    activeOpacity={0.9}
                    disabled={claiming}
                  >
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Mark as Claimed — only for the reporter, only when not already claimed */}
        {isOwner && item.status !== 'CLAIMED' && (
          <TouchableOpacity
            style={[styles.claimButton, claiming && styles.buttonDisabled]}
            onPress={handleClaim}
            disabled={claiming}
            activeOpacity={0.9}
          >
            {claiming ? (
              <ActivityIndicator color={Colors.surface} size="small" />
            ) : (
              <>
                <CheckCircle size={18} color={Colors.surface} strokeWidth={2.5} />
                <Text style={styles.claimButtonText}>Mark as Claimed</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Resolved state */}
        {item.status === 'CLAIMED' && (
          <View style={styles.resolvedBanner}>
            <TamarawBadge size={56} variant="claimed" label="DONE" />
            <Text style={styles.resolvedText}>This item has been claimed and resolved.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { paddingBottom: Spacing.xxl + Spacing.xl },

  // Loading / not found
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Hero
  heroImage: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
    backgroundColor: Colors.border,
  },
  heroPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  heroPlaceholderText: { fontSize: 14, color: Colors.textSecondary, fontFamily: FontFamily.bodySemiBold },

  // Status bar
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  securityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginLeft: 'auto',
    backgroundColor: `${Colors.accent}33`,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs - 1,
    borderRadius: Radius.pill,
  },
  securityPillText: { fontSize: 11, color: Colors.primary, fontFamily: FontFamily.bodyBold },

  // Card
  card: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: Radius.md,
    padding: Spacing.lg + 2,
    ...Shadow.soft,
  },

  // Title + description
  title: {
    fontSize: 22,
    fontFamily: FontFamily.displayBold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
    lineHeight: 28,
  },
  description: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
    fontFamily: FontFamily.bodySemiBold,
  },
  descriptionEmpty: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    fontFamily: FontFamily.bodyMedium,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md + 2,
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm - 2,
    backgroundColor: `${Colors.primary}12`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: { flex: 1 },
  infoLabel: {
    fontSize: 11,
    fontFamily: FontFamily.bodyBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs - 2,
  },
  infoValue: {
    fontSize: 15,
    fontFamily: FontFamily.bodySemiBold,
    color: Colors.textPrimary,
  },

  // Error
  errorBanner: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm + 2,
  },

  // Reporter
  sectionLabel: {
    fontSize: 11,
    fontFamily: FontFamily.bodyBold,
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  reporterRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${Colors.primary}14`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reporterInfo: { flex: 1 },
  reporterName: { fontSize: 15, color: Colors.textPrimary, fontFamily: FontFamily.displaySemiBold },
  verifiedBadge: {
    fontSize: 11,
    fontFamily: FontFamily.bodyBold,
    color: Colors.success,
    marginTop: Spacing.xs - 1,
  },

  // Actions
  actionsGroup: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    gap: Spacing.sm + 2,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 54,
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
  },
  contactButtonText: {
    fontSize: 16,
    fontFamily: FontFamily.displaySemiBold,
    color: Colors.primary,
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 54,
    backgroundColor: Colors.primaryEmphasis,
    borderRadius: Radius.md,
  },
  requestButtonText: {
    fontSize: 16,
    fontFamily: FontFamily.displaySemiBold,
    color: Colors.surface,
  },
  requestBlock: {
    gap: Spacing.xs,
  },
  requestHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: FontFamily.bodySemiBold,
    textAlign: 'center',
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 54,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
  },
  claimButtonText: {
    fontSize: 16,
    fontFamily: FontFamily.displaySemiBold,
    color: Colors.surface,
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    gap: Spacing.sm + 2,
  },
  requestInfo: {
    flex: 1,
    gap: Spacing.xs - 2,
  },
  requestName: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: FontFamily.displaySemiBold,
  },
  requestEmail: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: FontFamily.bodySemiBold,
  },
  requestMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: FontFamily.bodyMedium,
  },
  requestActionsCol: {
    width: 92,
    gap: Spacing.xs,
    alignSelf: 'center',
  },
  approveButton: {
    height: 32,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.successSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveButtonText: {
    fontSize: 13,
    color: Colors.success,
    fontFamily: FontFamily.bodyBold,
  },
  rejectButton: {
    height: 32,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.errorSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 13,
    color: Colors.error,
    fontFamily: FontFamily.bodyBold,
  },
  buttonDisabled: { opacity: 0.6 },
  resolvedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    backgroundColor: Colors.successSoft,
    borderRadius: Radius.md,
    padding: Spacing.lg,
  },
  resolvedText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.bodyBold,
    color: Colors.success,
    lineHeight: 20,
  },
});
