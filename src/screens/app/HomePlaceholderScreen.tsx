import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { Colors } from '../../theme/colors';

type Props = NativeStackScreenProps<AppStackParamList, 'Home' | 'ItemDetail'>;

/**
 * Temporary placeholder for the Home Feed (Phase 2).
 * Replaced by the real HomeScreen with the real-time Firestore listener.
 */
export default function HomePlaceholderScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📋</Text>
      <Text style={styles.title}>Home Feed</Text>
      <Text style={styles.sub}>Coming in Phase 2 — real-time lost & found items.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Report')}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>+ Report an Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.background,
  },
  emoji: { fontSize: 52, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.primary, marginBottom: 8 },
  sub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 32 },
  button: {
    height: 52,
    paddingHorizontal: 28,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
});
