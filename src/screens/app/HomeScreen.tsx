import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Plus, Search } from 'lucide-react-native';
import { ItemCardSkeleton } from '../../components/Skeleton';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { useItems } from '../../hooks/useItems';
import { useAuth } from '../../hooks/useAuth';
import ItemCard from '../../components/ItemCard';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { Radius, Shadow, Spacing } from '../../theme/tokens';
import type { ItemStatus, LostFoundItem } from '../../types';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

// ─── Filter tabs ──────────────────────────────────────────────────────────────

type FilterTab = 'ALL' | ItemStatus;

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL',     label: 'All'     },
  { key: 'LOST',    label: 'Lost'    },
  { key: 'FOUND',   label: 'Found'   },
  { key: 'CLAIMED', label: 'Claimed' },
];

const EMPTY_MESSAGES: Record<FilterTab, { variant: 'neutral' | 'lost' | 'found' | 'claimed'; label: string; title: string; sub: string }> = {
  ALL:     { variant: 'neutral', label: 'TAM', title: 'No items posted yet',    sub: 'Tap the + button below to report a lost or found item.' },
  LOST:    { variant: 'lost',    label: 'LOST', title: 'No lost items right now', sub: 'Check back later or tap the + button below to report a lost item.' },
  FOUND:   { variant: 'found',   label: 'FOUND', title: 'No found items yet',      sub: 'Tap the + button below to report a found item and help someone out!' },
  CLAIMED: { variant: 'claimed', label: 'DONE', title: 'Nothing claimed yet',     sub: 'Claimed items will appear here.' },
};


// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { user, logout } = useAuth();

  const statusFilter = activeTab === 'ALL' ? undefined : activeTab;
  const { items, loading, error } = useItems({ status: statusFilter });

  // Client-side search filter on top of the status filter
  const filtered = searchQuery.trim()
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : items;

  // Pull-to-refresh: Firestore listener already keeps data live;
  // we just provide the UX affordance with a brief visual delay.
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: LostFoundItem }) => (
      <ItemCard
        item={item}
        onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
      />
    ),
    [navigation],
  );

  const emptyContent = searchQuery.length > 0
    ? {
        variant: 'search' as const,
        label: 'FIND',
        title: `No results for "${searchQuery}"`,
        sub: 'Try a different keyword or clear the search.',
      }
    : EMPTY_MESSAGES[activeTab];

  return (
    <View style={styles.container}>
      {/* ── Search bar ── */}
      <View style={styles.searchWrapper}>
        <Search size={16} color={Colors.textSecondary} strokeWidth={2} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by title, location…"
          placeholderTextColor={Colors.textSecondary}
          returnKeyType="search"
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
      </View>

      {/* ── Filter tabs ── */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Error banner ── */}
      {error ? (
        <ErrorState compact message={error} style={styles.errorBanner} />
      ) : null}

      {/* ── List ── */}
      {loading ? (
        <View style={styles.listContent}>
          {[...Array(4)].map((_, i) => <ItemCardSkeleton key={i} />)}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            filtered.length === 0 && styles.listContentEmpty,
          ]}
          ListEmptyComponent={(
            <EmptyState
              title={emptyContent.title}
              subtitle={emptyContent.sub}
              variant={emptyContent.variant}
              label={emptyContent.label}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
        />
      )}

      {/* ── FAB ── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Report')}
        activeOpacity={0.85}
      >
        <Plus size={26} color={Colors.primary} strokeWidth={3} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Search
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    height: 44,
    ...Shadow.soft,
  },
  searchIcon: { marginRight: Spacing.sm },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: FontFamily.bodySemiBold,
  },

  // Tabs
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,255,255,0.93)',
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: { fontSize: 13, color: Colors.textSecondary, fontFamily: FontFamily.bodyBold },
  tabTextActive: { color: Colors.accent },

  // Error
  errorBanner: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm + 2,
  },

  // List
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: Spacing.xxl,
    right: Spacing.xl,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});
