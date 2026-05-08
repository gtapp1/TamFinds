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
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, ImageIcon, ChevronDown } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { useReportItem } from '../../hooks/useReportItem';
import ErrorState from '../../components/ErrorState';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { Radius, Shadow, Spacing } from '../../theme/tokens';
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
        <LinearGradient
          colors={[Colors.primary, Colors.primaryEmphasis]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>New Report</Text>
          <Text style={styles.headerSub}>Help your fellow Tamaraws</Text>
        </LinearGradient>

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
            placeholder="e.g. Feu ID, Tumbler, Jisulife"
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
            placeholder="e.g. TED Library, Room 607, Canteen"
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
          <ErrorState compact message={error} style={styles.errorBox} />
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
              {draft.status === 'LOST' ? 'Post Lost Item' : 'Post Found Item'}
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl + Spacing.xl,
    gap: Spacing.md,
  },

  // Header
  header: {
    marginBottom: Spacing.xs,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg + 2,
    paddingVertical: Spacing.lg,
  },
  headerTitle: { fontSize: 26, color: Colors.accent, fontFamily: FontFamily.displayBold },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2, fontFamily: FontFamily.bodySemiBold },

  // Card
  card: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: Radius.lg,
    padding: Spacing.lg + 2,
    ...Shadow.card,
  },

  // Section label
  sectionLabel: {
    fontSize: 11,
    fontFamily: FontFamily.bodyBold,
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },

  // Field label
  fieldLabel: {
    fontSize: 13,
    fontFamily: FontFamily.bodyBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm - 2,
    marginTop: Spacing.xs,
  },

  // Input
  input: {
    height: 46,
    borderWidth: 0,
    borderRadius: Radius.sm + 2,
    paddingHorizontal: Spacing.md,
    fontSize: 15,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceAlt,
    marginBottom: Spacing.md,
    fontFamily: FontFamily.bodySemiBold,
  },
  inputMulti: {
    height: 80,
    paddingTop: Spacing.sm + 2,
  },

  // Photo
  photoButtons: { gap: Spacing.sm + 2 },
  snapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 52,
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm + 2,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 52,
    backgroundColor: Colors.muted,
    borderRadius: Radius.sm + 2,
    borderWidth: 0,
  },
  snapButtonText: {
    fontSize: 15,
    fontFamily: FontFamily.displaySemiBold,
    color: Colors.primary,
  },
  imagePreviewWrapper: { position: 'relative' },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: Radius.sm + 2,
    resizeMode: 'cover',
    backgroundColor: Colors.border,
  },
  retakeButton: {
    position: 'absolute',
    bottom: Spacing.sm + 2,
    right: Spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: `${Colors.accent}EE`,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radius.pill,
  },
  retakeText: { fontSize: 12, color: Colors.primary, fontFamily: FontFamily.bodyBold },

  // Status toggle
  statusRow: { flexDirection: 'row', gap: Spacing.sm + 2 },
  statusChip: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Radius.sm + 2,
    backgroundColor: Colors.surfaceAlt,
  },
  statusChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  statusChipText: { fontSize: 14, color: Colors.textSecondary, fontFamily: FontFamily.bodyBold },
  statusChipTextActive: { color: Colors.accent },

  // Category grid
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surfaceAlt,
  },
  categoryChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  categoryChipText: { fontSize: 13, color: Colors.textSecondary, fontFamily: FontFamily.bodyBold },
  categoryChipTextActive: { color: Colors.primary },

  // Security row
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  securityTextGroup: { flex: 1 },
  securityTitle: { fontSize: 15, color: Colors.textPrimary, fontFamily: FontFamily.displaySemiBold },
  securitySub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2, fontFamily: FontFamily.bodySemiBold },

  // Error
  errorBox: {
    marginTop: Spacing.xs,
  },

  // Submit
  submitButton: {
    height: 56,
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { fontSize: 17, color: Colors.primary, fontFamily: FontFamily.displayBold },
  uploadingHint: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    fontFamily: FontFamily.bodySemiBold,
  },
});
