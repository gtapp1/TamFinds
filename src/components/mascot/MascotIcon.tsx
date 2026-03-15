import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

type MascotIconVariant = 'neutral' | 'search' | 'lost' | 'found' | 'claimed';

interface MascotIconProps {
  variant: MascotIconVariant;
  size?: number;
}

const ICONS = {
  neutral: require('../../../assets/mascot/icons/neutral.png'),
  search: require('../../../assets/mascot/icons/search.png'),
  lost: require('../../../assets/mascot/icons/lost.png'),
  found: require('../../../assets/mascot/icons/found.png'),
  claimed: require('../../../assets/mascot/icons/claimed.png'),
} as const;

export default function MascotIcon({ variant, size = 18 }: MascotIconProps) {
  return (
    <View style={styles.shell}>
      <Image
        source={ICONS[variant]}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});