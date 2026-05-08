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

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const SCHOOL_DOMAIN = '@feuroosevelt.edu.ph';

export default function RegisterScreen({ navigation }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const { register, loading, error, clearError } = useAuth();

  const isSchoolEmail = email.toLowerCase().endsWith(SCHOOL_DOMAIN);

  const handleRegister = async () => {
    if (!displayName.trim() || !email.trim() || !password) return;
    if (password !== confirm) {
      clearError();
      return;
    }
    await register(email.trim(), password, displayName.trim());
  };

  const passwordMismatch = confirm.length > 0 && password !== confirm;

  return (
    <LinearGradient colors={[Colors.primary, Colors.primaryEmphasis, Colors.primary]} style={styles.flex}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brand}>TamFinds</Text>
            <Text style={styles.tagline}>Create your campus account</Text>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Text style={styles.title}>Join TamFinds</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

            <View style={styles.field}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={(v) => { clearError(); setDisplayName(v); }}
                placeholder="Juan dela Cruz"
                placeholderTextColor={Colors.textSecondary}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

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
              {isSchoolEmail && email.length > 0 && (
                <Text style={styles.verifiedBadge}>✓ FEU Roosevelt email — verified account</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(v) => { clearError(); setPassword(v); }}
                placeholder="At least 6 characters"
                placeholderTextColor={Colors.textSecondary}
                secureTextEntry
                autoComplete="new-password"
                returnKeyType="next"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[styles.input, passwordMismatch && styles.inputError]}
                value={confirm}
                onChangeText={setConfirm}
                placeholder="••••••••"
                placeholderTextColor={Colors.textSecondary}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
              {passwordMismatch && (
                <Text style={styles.fieldError}>Passwords do not match.</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, (loading || passwordMismatch) && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading || passwordMismatch}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
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
  header: { alignItems: 'center', marginBottom: 36 },
  brand: {
    fontSize: 42,
    fontFamily: FontFamily.displayBold,
    color: Colors.accent,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 13,
    color: Colors.surfaceOverlaySubtle,
    marginTop: 4,
    letterSpacing: 0.5,
    fontFamily: FontFamily.bodySemiBold,
  },
  card: {
    backgroundColor: Colors.surfaceOverlayStrong,
    borderRadius: 24,
    padding: 28,
    shadowColor: Colors.primary,
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
    backgroundColor: Colors.errorSoft,
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
    backgroundColor: Colors.surfaceAlt,
    fontFamily: FontFamily.bodySemiBold,
  },
  inputError: { borderColor: Colors.error },
  fieldError: { color: Colors.error, fontSize: 12, marginTop: 4, fontFamily: FontFamily.bodySemiBold },
  verifiedBadge: {
    color: Colors.success,
    fontSize: 12,
    marginTop: 4,
    fontFamily: FontFamily.bodyBold,
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
  footerText: { color: Colors.surfaceOverlaySubtle, fontSize: 14, fontFamily: FontFamily.bodySemiBold },
  footerLink: {
    color: Colors.accent,
    fontSize: 14,
    fontFamily: FontFamily.displaySemiBold,
  },
});
