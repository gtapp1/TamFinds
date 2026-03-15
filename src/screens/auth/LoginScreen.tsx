import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/useAuth';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password) return;
    const user = await login(email.trim(), password);
    if (user) {
      // RootNavigator will automatically redirect on auth state change (Phase 2)
    }
  };

  return (
    <LinearGradient colors={['#003829', '#015D45', '#003829']} style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brand}>TamFinds</Text>
            <Text style={styles.tagline}>FEU Roosevelt Lost and Found</Text>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Text style={styles.title}>Welcome back</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(v) => { clearError(); setEmail(v); }}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(v) => { clearError(); setPassword(v); }}
                placeholder="••••••••"
                placeholderTextColor={Colors.textSecondary}
                secureTextEntry
                autoComplete="current-password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  header: { alignItems: 'center', marginBottom: 40 },
  brand: {
    fontSize: 42,
    fontFamily: FontFamily.displayBold,
    color: Colors.accent,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    letterSpacing: 0.5,
    fontFamily: FontFamily.bodySemiBold,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 7,
  },
  title: {
    fontSize: 22,
    fontFamily: FontFamily.displaySemiBold,
    color: Colors.primary,
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: Colors.error, fontSize: 13, fontFamily: FontFamily.bodySemiBold },
  field: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontFamily: FontFamily.bodyBold,
    color: Colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 48,
    borderWidth: 0,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    backgroundColor: '#F3F7F4',
    fontFamily: FontFamily.bodySemiBold,
  },
  button: {
    height: 52,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    fontSize: 16,
    fontFamily: FontFamily.displaySemiBold,
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: { color: 'rgba(255,255,255,0.75)', fontSize: 14, fontFamily: FontFamily.bodySemiBold },
  footerLink: {
    color: Colors.accent,
    fontSize: 14,
    fontFamily: FontFamily.displaySemiBold,
  },
});
