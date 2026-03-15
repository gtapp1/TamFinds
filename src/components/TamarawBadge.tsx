import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import { FontFamily } from '../theme/typography';

type TamarawBadgeVariant = 'neutral' | 'search' | 'lost' | 'found' | 'claimed';

interface TamarawBadgeProps {
  size?: number;
  variant?: TamarawBadgeVariant;
  label?: string;
  showLabel?: boolean;
}

const ICON_BY_VARIANT = {
  neutral: require('../../assets/mascot/icons/neutral.png'),
  search: require('../../assets/mascot/icons/search.png'),
  lost: require('../../assets/mascot/icons/lost.png'),
  found: require('../../assets/mascot/icons/found.png'),
  claimed: require('../../assets/mascot/icons/claimed.png'),
} as const;

export default function TamarawBadge({
  size = 72,
  variant = 'neutral',
  label = 'TAM',
  showLabel = true,
}: TamarawBadgeProps) {
  const iconSource = ICON_BY_VARIANT[variant];
  const iconSize = Math.round(size * 1.6);

  return (
    <View style={[styles.shell, { width: size, height: size + (showLabel ? 18 : 0) }]}> 
      <View style={[styles.iconWrap, { width: size, height: size }]}> 
        <Image
          source={iconSource}
          style={{ width: iconSize, height: iconSize }}
          resizeMode="contain"
        />
      </View>
      {showLabel ? (
        <View style={styles.ribbon}>
          <Text style={styles.ribbonText}>{label}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 6,
  },
  ribbon: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ribbonText: {
    color: Colors.accent,
    fontFamily: FontFamily.displayBold,
    fontSize: 10,
    letterSpacing: 0.6,
  },
});