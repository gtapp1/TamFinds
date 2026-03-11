import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImageIcon, ChevronDown, AlertCircle } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { useReportItem } from '../../hooks/useReportItem';
import { Colors } from '../../theme/colors';
import type { ReportDraft, ItemCategory, ItemStatus } from '../../types';

type Props = NativeStackScreenProps<AppStackParamList, 'Report'>;

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: ItemCategory[] = ['Electronics', 'IDs', 'Books', 'Personal'];

const INITIAL_DRAFT: ReportDraft = {
  title: '',
  description: '',
  location: '',
  category: 'Personal',
  status: 'LOST',
  isAtSecurity: false,
  localImageUri: null,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function StatusToggle({
  value,
  onChange,
}: {
  value: ItemStatus;
  onChange: (v: ItemStatus) => void;
}) {
  return (
    <View style={styles.statusRow}>
      {(['LOST', 'FOUND'] as ItemStatus[]).map((s) => (
        <TouchableOpacity
          key={s}
          style={[styles.statusChip, value === s && styles.statusChipActive]}
          onPress={() => onChange(s)}
          activeOpacity={0.8}
        >
          <Text style={[styles.statusChipText, value === s && styles.statusChipTextActive]}>
            {s}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function CategoryPicker({
  value,
  onChange,
}: {
  value: ItemCategory;
  onChange: (v: ItemCategory) => void;
}) {
  return (
    <View style={styles.categoryGrid}>
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[styles.categoryChip, value === cat && styles.categoryChipActive]}
          onPress={() => onChange(cat)}
          activeOpacity={0.8}
        >
          <Text style={[styles.categoryChipText, value === cat && styles.categoryChipTextActive]}>
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ReportScreen({ navigation }: Props) {
  const [draft, setDraft] = useState<ReportDraft>(INITIAL_DRAFT);
  const { submitting, error, submitReport, clearError } = useReportItem();

  function update<K extends keyof ReportDraft>(key: K, value: ReportDraft[K]) {
    clearError();
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  // ── Image Picker ────────────────────────────────────────────────────────────

  async function handleCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera access required', 'Please enable camera access in your device settings.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      update('localImageUri', result.assets[0].uri);
    }
  }

  async function handleGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Library access required', 'Please enable photo library access in your device settings.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      update('localImageUri', result.assets[0].uri);
    }
  }

  // ── Submission ──────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!draft.title.trim()) {
      Alert.alert('Missing info', 'Please enter a title for the item.');
      return;
    }
    if (!draft.location.trim()) {
      Alert.alert('Missing info', 'Please specify where the item was lost or found.');
      return;
    }

    const itemId = await submitReport(draft);
    if (itemId) {
      Alert.alert('Report submitted!', 'Your item has been posted to TamFinds.', [
        {
          text: 'View Feed',
          onPress: () => navigation.navigate('Home'),
        },
      ]);
      setDraft(INITIAL_DRAFT);
    }
  }

  const isReady = draft.title.trim().length > 0 && draft.location.trim().length > 0 && !!draft.localImageUri;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>New Report</Text>
          <Text style={styles.headerSub}>Help your fellow Tamaraws</Text>
        </View>

        {/* ── 1. Photo ── */}
        <View style={styles.card}>
          <SectionLabel>PHOTO *</SectionLabel>

          {draft.localImageUri ? (
            <View style={styles.imagePreviewWrapper}>
              <Image source={{ uri: draft.localImageUri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={handleCamera}
                activeOpacity={0.8}
              >
                <Camera size={16} color={Colors.primary} />
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.snapButton} onPress={handleCamera} activeOpacity={0.85}>
                <Camera size={22} color={Colors.primary} strokeWidth={2} />
                <Text style={styles.snapButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.galleryButton} onPress={handleGallery} activeOpacity={0.85}>
                <ImageIcon size={22} color={Colors.primary} strokeWidth={2} />
                <Text style={styles.snapButtonText}>Choose from Library</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ── 2. Status ── */}
        <View style={styles.card}>
          <SectionLabel>I AM REPORTING A...</SectionLabel>
          <StatusToggle value={draft.status} onChange={(v) => update('status', v)} />
        </View>

        {/* ── 3. Details ── */}
        <View style={styles.card}>
          <SectionLabel>ITEM DETAILS</SectionLabel>

          <Text style={styles.fieldLabel}>Title *</Text>
          <TextInput
            style={styles.input}
            value={draft.title}
            onChangeText={(v) => update('title', v)}
            placeholder="e.g. FEUR ID, Blue Umbrella, JisuLife"
            placeholderTextColor={Colors.textSecondary}
            maxLength={80}
            returnKeyType="next"
          />

          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.inputMulti]}
            value={draft.description}
            onChangeText={(v) => update('description', v)}
            placeholder="Brand, color, distinguishing marks..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={3}
            maxLength={280}
            textAlignVertical="top"
          />

          <Text style={styles.fieldLabel}>Location Found / Last Seen *</Text>
          <TextInput
            style={styles.input}
            value={draft.location}
            onChangeText={(v) => update('location', v)}
            placeholder="e.g. Library 3F, Room 607, Canteen"
            placeholderTextColor={Colors.textSecondary}
            maxLength={100}
            returnKeyType="done"
          />
        </View>

        {/* ── 4. Category ── */}
        <View style={styles.card}>
          <SectionLabel>CATEGORY</SectionLabel>
          <CategoryPicker value={draft.category} onChange={(v) => update('category', v)} />
        </View>

        {/* ── 5. Security Office ── */}
        <View style={[styles.card, styles.securityRow]}>
          <View style={styles.securityTextGroup}>
            <Text style={styles.securityTitle}>Turned in to Security?</Text>
            <Text style={styles.securitySub}>Item is at the FEU Guard post</Text>
          </View>
          <Switch
            value={draft.isAtSecurity}
            onValueChange={(v) => update('isAtSecurity', v)}
            trackColor={{ false: Colors.border, true: Colors.accent }}
            thumbColor={draft.isAtSecurity ? Colors.primary : Colors.surface}
          />
        </View>

        {/* ── Error ── */}
        {error ? (
          <View style={styles.errorBox}>
            <AlertCircle size={16} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* ── Submit ── */}
        <TouchableOpacity
          style={[styles.submitButton, (!isReady || submitting) && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={!isReady || submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <Text style={styles.submitText}>
              {draft.status === 'LOST' ? '🔍 Post Lost Item' : '📦 Post Found Item'}
            </Text>
          )}
        </TouchableOpacity>

        {submitting && (
          <Text style={styles.uploadingHint}>Uploading photo & saving report…</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 12,
  },

  // Header
  header: { marginBottom: 4 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: Colors.primary },
  headerSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

  // Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  // Field label
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 4,
  },

  // Input
  input: {
    height: 46,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
    marginBottom: 12,
  },
  inputMulti: {
    height: 80,
    paddingTop: 10,
  },

  // Photo
  photoButtons: { gap: 10 },
  snapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    backgroundColor: Colors.accent,
    borderRadius: 12,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    backgroundColor: Colors.muted,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  snapButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  imagePreviewWrapper: { position: 'relative' },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
    backgroundColor: Colors.border,
  },
  retakeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${Colors.accent}EE`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  retakeText: { fontSize: 12, fontWeight: '700', color: Colors.primary },

  // Status toggle
  statusRow: { flexDirection: 'row', gap: 10 },
  statusChip: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  statusChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  statusChipText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  statusChipTextActive: { color: Colors.accent },

  // Category grid
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  categoryChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  categoryChipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  categoryChipTextActive: { color: Colors.primary },

  // Security row
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  securityTextGroup: { flex: 1 },
  securityTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  securitySub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },

  // Error
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 12,
  },
  errorText: { flex: 1, color: Colors.error, fontSize: 13 },

  // Submit
  submitButton: {
    height: 56,
    backgroundColor: Colors.accent,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { fontSize: 17, fontWeight: '800', color: Colors.primary },
  uploadingHint: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 8,
  },
});
