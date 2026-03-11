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
  AlertCircle,
} from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { useItemDetail } from '../../hooks/useItemDetail';
import { Colors } from '../../theme/colors';
import { ItemDetailSkeleton } from '../../components/Skeleton';
import type { ItemStatus } from '../../types';

type Props = NativeStackScreenProps<AppStackParamList, 'ItemDetail'>;

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ItemStatus, { bg: string; text: string; label: string; icon: string }> = {
  LOST:    { bg: '#FEE2E2', text: Colors.error,         label: 'LOST',    icon: '🔍' },
  FOUND:   { bg: '#DCFCE7', text: Colors.success,       label: 'FOUND',   icon: '📦' },
  CLAIMED: { bg: Colors.muted, text: Colors.textSecondary, label: 'CLAIMED', icon: '✅' },
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
  const { item, reporter, loading, error, isOwner, claiming, markAsClaimed } = useItemDetail(itemId);

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <ItemDetailSkeleton />
      </ScrollView>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────

  if (!item) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundEmoji}>🗑️</Text>
        <Text style={styles.notFoundTitle}>Item no longer exists</Text>
        <Text style={styles.notFoundSub}>It may have been removed.</Text>
      </View>
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
          <Text style={styles.heroPlaceholderText}>No photo</Text>
        </View>
      )}

      {/* ── Status bar ── */}
      <View style={[styles.statusBar, { backgroundColor: badge.bg }]}>
        <Text style={styles.statusBarEmoji}>{badge.icon}</Text>
        <Text style={[styles.statusBarLabel, { color: badge.text }]}>{badge.label}</Text>
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
        <View style={styles.errorBanner}>
          <AlertCircle size={14} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
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
          <TouchableOpacity style={styles.contactButton} onPress={handleContact} activeOpacity={0.85}>
            <Mail size={18} color={Colors.primary} strokeWidth={2.5} />
            <Text style={styles.contactButtonText}>Contact Reporter</Text>
          </TouchableOpacity>
        )}

        {/* Mark as Claimed — only for the reporter, only when not already claimed */}
        {isOwner && item.status !== 'CLAIMED' && (
          <TouchableOpacity
            style={[styles.claimButton, claiming && styles.buttonDisabled]}
            onPress={handleClaim}
            disabled={claiming}
            activeOpacity={0.85}
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
            <Text style={styles.resolvedEmoji}>🎉</Text>
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
  container: { paddingBottom: 48 },

  // Loading / not found
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 32,
  },
  notFoundEmoji: { fontSize: 52, marginBottom: 16 },
  notFoundTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  notFoundSub: { fontSize: 14, color: Colors.textSecondary },

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
    backgroundColor: Colors.muted,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  heroPlaceholderText: { fontSize: 14, color: Colors.textSecondary },

  // Status bar
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  statusBarEmoji: { fontSize: 16 },
  statusBarLabel: { fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  securityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
    backgroundColor: `${Colors.accent}33`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  securityPillText: { fontSize: 11, fontWeight: '700', color: Colors.primary },

  // Card
  card: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // Title + description
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 8,
    lineHeight: 28,
  },
  description: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  descriptionEmpty: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 14,
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${Colors.primary}12`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: { flex: 1, paddingTop: 2 },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },

  // Error
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 12,
  },
  errorText: { flex: 1, color: Colors.error, fontSize: 13 },

  // Reporter
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  reporterRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${Colors.primary}14`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reporterInfo: { flex: 1 },
  reporterName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  verifiedBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.success,
    marginTop: 3,
  },

  // Actions
  actionsGroup: {
    marginHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    backgroundColor: Colors.accent,
    borderRadius: 14,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    backgroundColor: Colors.primary,
    borderRadius: 14,
  },
  claimButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.surface,
  },
  buttonDisabled: { opacity: 0.6 },
  resolvedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#DCFCE7',
    borderRadius: 14,
    padding: 16,
  },
  resolvedEmoji: { fontSize: 22 },
  resolvedText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
    lineHeight: 20,
  },
});
