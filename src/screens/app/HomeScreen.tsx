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
import { Plus, Search, AlertCircle } from 'lucide-react-native';
import { ItemCardSkeleton } from '../../components/Skeleton';
import TamarawBadge from '../../components/TamarawBadge';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import { useItems } from '../../hooks/useItems';
import { useAuth } from '../../hooks/useAuth';
import ItemCard from '../../components/ItemCard';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
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

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ activeTab, query }: { activeTab: FilterTab; query: string }) {
  if (query.length > 0) {
    return (
      <View style={styles.emptyContainer}>
        <TamarawBadge size={76} variant="search" label="FIND" />
        <Text style={styles.emptyTitle}>No results for "{query}"</Text>
        <Text style={styles.emptySub}>Try a different keyword or clear the search.</Text>
      </View>
    );
  }
  const messages: Record<FilterTab, { variant: 'neutral' | 'lost' | 'found' | 'claimed'; label: string; title: string; sub: string }> = {
    ALL:     { variant: 'neutral', label: 'TAM', title: 'No items posted yet',    sub: 'Be the first to report a lost or found item.' },
    LOST:    { variant: 'lost',    label: 'LOST', title: 'No lost items right now', sub: 'Check back later or report a lost item.' },
    FOUND:   { variant: 'found',   label: 'FOUND', title: 'No found items yet',      sub: 'Report a found item to help someone out!' },
    CLAIMED: { variant: 'claimed', label: 'DONE', title: 'Nothing claimed yet',     sub: 'Claimed items will appear here.' },
  };
  const { variant, label, title, sub } = messages[activeTab];
  return (
    <View style={styles.emptyContainer}>
      <TamarawBadge size={76} variant={variant} label={label} />
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySub}>{sub}</Text>
    </View>
  );
}


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
        <View style={styles.errorBanner}>
          <AlertCircle size={14} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
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
          ListEmptyComponent={<EmptyState activeTab={activeTab} query={searchQuery} />}
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
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: FontFamily.bodySemiBold,
  },

  // Tabs
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 10,
  },
  errorText: { flex: 1, fontSize: 13, color: Colors.error, fontFamily: FontFamily.bodySemiBold },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: FontFamily.displaySemiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
    marginTop: 18,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: FontFamily.bodySemiBold,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 20,
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
