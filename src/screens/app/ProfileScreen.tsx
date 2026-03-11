import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { User, Mail, Shield, LogOut, ChevronRight } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/useAuth';
import { Colors } from '../../theme/colors';

type Props = NativeStackScreenProps<AppStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of TamFinds?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // RootNavigator will automatically redirect to AuthNavigator
          },
        },
      ],
    );
  };

  const isSchoolEmail = user?.email?.toLowerCase().endsWith('@feuroosevelt.edu.ph') ?? false;
  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

      {/* ── Avatar block ── */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>{initials}</Text>
        </View>
        <Text style={styles.displayName}>{user?.displayName ?? '—'}</Text>
        {isSchoolEmail && (
          <View style={styles.verifiedRow}>
            <Shield size={13} color={Colors.success} strokeWidth={2.5} />
            <Text style={styles.verifiedText}>FEU Roosevelt Verified</Text>
          </View>
        )}
      </View>

      {/* ── Account info ── */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>ACCOUNT</Text>

        <View style={styles.infoRow}>
          <View style={styles.iconTile}>
            <User size={16} color={Colors.primary} strokeWidth={2} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Display Name</Text>
            <Text style={styles.infoValue}>{user?.displayName ?? '—'}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <View style={styles.iconTile}>
            <Mail size={16} color={Colors.primary} strokeWidth={2} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue} numberOfLines={1}>{user?.email ?? '—'}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <View style={styles.iconTile}>
            <Shield size={16} color={Colors.primary} strokeWidth={2} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Account Type</Text>
            <Text style={styles.infoValue}>
              {isSchoolEmail ? 'FEU Roosevelt Student' : 'Guest Account'}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Activity quick-link ── */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>ACTIVITY</Text>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.75}
        >
          <Text style={styles.linkText}>View All Items</Text>
          <ChevronRight size={16} color={Colors.textSecondary} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => navigation.navigate('Report')}
          activeOpacity={0.75}
        >
          <Text style={styles.linkText}>Report New Item</Text>
          <ChevronRight size={16} color={Colors.textSecondary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* ── Logout ── */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
        <LogOut size={18} color={Colors.error} strokeWidth={2.5} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* ── App version ── */}
      <Text style={styles.versionText}>TamFinds v1.0 · FEU Roosevelt</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  container: { paddingBottom: 48 },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 28,
    backgroundColor: Colors.primary,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarInitials: { fontSize: 30, fontWeight: '800', color: Colors.primary },
  displayName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.surface,
    marginBottom: 6,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  verifiedText: { fontSize: 12, fontWeight: '600', color: Colors.success },

  // Cards
  card: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 14,
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: `${Colors.primary}12`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: { flex: 1 },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  infoValue: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },

  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
    marginLeft: 46,
  },

  // Link rows
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  linkText: { fontSize: 15, fontWeight: '600', color: Colors.primary },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 20,
    height: 52,
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: Colors.error },

  // Footer
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 24,
  },
});
