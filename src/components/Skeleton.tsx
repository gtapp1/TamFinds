import React, { useEffect } from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';

interface SkeletonPulseProps {
  width?: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Single animated skeleton line — pulses between muted and border colors.
 * Uses react-native-reanimated for native-thread animation (60fps, no JS lag).
 */
export function SkeletonPulse({ width = '100%', height, borderRadius = 8, style }: SkeletonPulseProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.35, { duration: 750, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: Colors.border },
        animatedStyle,
        style,
      ]}
    />
  );
}

// ─── Pre-built card skeleton matching ItemCard dimensions ─────────────────────

export function ItemCardSkeleton() {
  return (
    <View style={styles.card}>
      <SkeletonPulse width={90} height={90} borderRadius={0} />
      <View style={styles.content}>
        <SkeletonPulse width="35%" height={12} borderRadius={6} style={styles.line} />
        <SkeletonPulse width="85%" height={14} borderRadius={6} style={styles.line} />
        <SkeletonPulse width="55%" height={11} borderRadius={6} style={styles.line} />
      </View>
      <View style={styles.accentBar} />
    </View>
  );
}

// ─── Pre-built detail screen skeleton ────────────────────────────────────────

export function ItemDetailSkeleton() {
  return (
    <View style={styles.detailContainer}>
      <SkeletonPulse width="100%" height={280} borderRadius={0} />
      <View style={styles.detailCard}>
        <SkeletonPulse width="25%" height={12} borderRadius={6} style={styles.line} />
        <SkeletonPulse width="70%" height={24} borderRadius={8} style={styles.line} />
        <SkeletonPulse width="100%" height={14} borderRadius={6} style={styles.line} />
        <SkeletonPulse width="80%" height={14} borderRadius={6} style={styles.line} />
        <View style={styles.divider} />
        {[...Array(3)].map((_, i) => (
          <View key={i} style={styles.infoRowSkeleton}>
            <SkeletonPulse width={32} height={32} borderRadius={8} />
            <View style={styles.infoTextSkeleton}>
              <SkeletonPulse width="30%" height={10} borderRadius={4} style={styles.lineSm} />
              <SkeletonPulse width="60%" height={14} borderRadius={6} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Card skeleton — matches ItemCard layout exactly
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    height: 90,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 6,
    justifyContent: 'center',
  },
  accentBar: { width: 4, backgroundColor: Colors.muted },
  line: { marginBottom: 0 },

  // Detail skeleton
  detailContainer: { backgroundColor: Colors.background },
  detailCard: {
    margin: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    gap: 10,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  infoRowSkeleton: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  infoTextSkeleton: { flex: 1, gap: 6 },
  lineSm: { marginBottom: 0 },
});
