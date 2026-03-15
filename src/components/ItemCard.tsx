import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Shield } from 'lucide-react-native';
import TamarawBadge from './TamarawBadge';
import { Colors } from '../theme/colors';
import { FontFamily } from '../theme/typography';
import type { LostFoundItem, ItemStatus } from '../types';

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_STYLE: Record<ItemStatus, { bg: string; text: string; label: string }> = {
  LOST:    { bg: '#FEE2E2', text: Colors.error,   label: 'LOST'    },
  FOUND:   { bg: '#DCFCE7', text: Colors.success,  label: 'FOUND'   },
  CLAIMED: { bg: Colors.muted, text: Colors.textSecondary, label: 'CLAIMED' },
};

// ─── Relative time helper ─────────────────────────────────────────────────────

function relativeTime(seconds: number): string {
  const diff = Math.floor(Date.now() / 1000) - seconds;
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ItemCardProps {
  item: LostFoundItem;
  onPress: () => void;
}

export default function ItemCard({ item, onPress }: ItemCardProps) {
  const badge = STATUS_STYLE[item.status];
  const timeAgo = item.reportedAt?.seconds
    ? relativeTime(item.reportedAt.seconds)
    : '';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.82}>
      {/* Left — Image */}
      <View style={styles.imageWrapper}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <TamarawBadge
              size={56}
              variant={item.status === 'LOST' ? 'lost' : item.status === 'FOUND' ? 'found' : 'claimed'}
              label="TAM"
              showLabel={false}
            />
          </View>
        )}
        {/* Category chip overlaid on image */}
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>

      {/* Right — Content */}
      <View style={styles.content}>
        {/* Top row: status badge + time */}
        <View style={styles.topRow}>
          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.statusText, { color: badge.text }]}>{badge.label}</Text>
          </View>
          <Text style={styles.time}>{timeAgo}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

        {/* Location */}
        <View style={styles.metaRow}>
          <MapPin size={12} color={Colors.textSecondary} strokeWidth={2} />
          <Text style={styles.metaText} numberOfLines={1}>{item.location}</Text>
        </View>

        {/* Security badge */}
        {item.isAtSecurity && (
          <View style={styles.securityBadge}>
            <Shield size={11} color={Colors.primary} strokeWidth={2.5} />
            <Text style={styles.securityText}>At Security Office</Text>
          </View>
        )}
      </View>

      {/* Right accent bar */}
      <View style={[styles.accentBar, item.status === 'FOUND' ? styles.accentBarFound : item.status === 'CLAIMED' ? styles.accentBarClaimed : null]} />
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD_IMAGE_SIZE = 90;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },

  // Left image block
  imageWrapper: {
    width: CARD_IMAGE_SIZE,
    height: CARD_IMAGE_SIZE,
    backgroundColor: Colors.muted,
    position: 'relative',
  },
  image: {
    width: CARD_IMAGE_SIZE,
    height: CARD_IMAGE_SIZE,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: CARD_IMAGE_SIZE,
    height: CARD_IMAGE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.border,
  },
  categoryChip: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,56,41,0.82)',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  categoryText: { fontSize: 9, color: Colors.accent, letterSpacing: 0.3, fontFamily: FontFamily.bodyBold },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: { fontSize: 10, letterSpacing: 0.5, fontFamily: FontFamily.bodyBold },
  time: { fontSize: 11, color: Colors.textSecondary, fontFamily: FontFamily.bodySemiBold },

  title: {
    fontSize: 14,
    fontFamily: FontFamily.displaySemiBold,
    color: Colors.textPrimary,
    lineHeight: 19,
    marginBottom: 5,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: { fontSize: 12, color: Colors.textSecondary, flex: 1, fontFamily: FontFamily.bodySemiBold },

  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
    backgroundColor: `${Colors.accent}28`,
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  securityText: { fontSize: 10, color: Colors.primary, fontFamily: FontFamily.bodyBold },

  // Right accent bar (color-coded by status)
  accentBar: {
    width: 4,
    backgroundColor: Colors.error,
  },
  accentBarFound: { backgroundColor: Colors.success },
  accentBarClaimed: { backgroundColor: Colors.border },
});
