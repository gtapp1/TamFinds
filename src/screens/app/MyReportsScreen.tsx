import React, { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../navigation/types';
import ItemCard from '../../components/ItemCard';
import { ItemCardSkeleton } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import ClaimRequestCard from '../../components/ClaimRequestCard';
import {
  useMyClaimRequests,
  type ClaimRequestWithItem,
  type MyReportsTab,
} from '../../hooks/useMyClaimRequests';
import type { LostFoundItem } from '../../types';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { Radius, Spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<AppStackParamList, 'MyReports'>;

export default function MyReportsScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<MyReportsTab>('MY_ITEMS');
  const {
    myItems,
    myClaims,
    pendingClaimsForMyItems,
    loading,
    error,
    actionLoadingId,
    approveClaim,
    rejectClaim,
  } = useMyClaimRequests();

  const tabs: { key: MyReportsTab; label: string; count?: number }[] = useMemo(
    () => [
      { key: 'MY_ITEMS', label: 'My Items', count: myItems.length },
      { key: 'I_AM_CLAIMING', label: "I'm Claiming", count: myClaims.length },
      { key: 'PENDING_CLAIMS', label: 'Pending Claims', count: pendingClaimsForMyItems.length },
    ],
    [myItems.length, myClaims.length, pendingClaimsForMyItems.length],
  );

  const listData: Array<LostFoundItem | ClaimRequestWithItem> =
    activeTab === 'MY_ITEMS'
      ? myItems
      : activeTab === 'I_AM_CLAIMING'
        ? myClaims
        : pendingClaimsForMyItems;

  return (
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.84}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
            <View style={[styles.countChip, activeTab === tab.key && styles.countChipActive]}>
              <Text style={[styles.countText, activeTab === tab.key && styles.countTextActive]}>{tab.count ?? 0}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {error ? (
        <ErrorState compact message={error} style={styles.errorBanner} />
      ) : null}

      {loading ? (
        <View style={styles.listPadding}>
          {[...Array(3)].map((_, i) => <ItemCardSkeleton key={i} />)}
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listPadding,
            ((activeTab === 'MY_ITEMS' && myItems.length === 0)
              || (activeTab === 'I_AM_CLAIMING' && myClaims.length === 0)
              || (activeTab === 'PENDING_CLAIMS' && pendingClaimsForMyItems.length === 0))
              && styles.emptyGrow,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={(
            <RefreshControl
              refreshing={false}
              onRefresh={() => {}}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          )}
          renderItem={({ item }) => {
            if (activeTab === 'MY_ITEMS') {
              const myItem = item as LostFoundItem;
              return (
                <ItemCard
                  item={myItem}
                  onPress={() => navigation.navigate('ItemDetail', { itemId: myItem.id })}
                />
              );
            }

            const request = item as ClaimRequestWithItem;
            const timestamp = request.createdAt?.seconds
              ? new Date(request.createdAt.seconds * 1000).toLocaleString()
              : 'Just now';

            return (
              <ClaimRequestCard
                title={request.itemTitle ?? 'Unknown item'}
                subtitle={`Requested: ${timestamp}`}
                status={request.status}
                requesterName={activeTab === 'PENDING_CLAIMS' ? request.requesterName : undefined}
                requesterEmail={activeTab === 'PENDING_CLAIMS' ? request.requesterEmail : undefined}
                canReview={activeTab === 'PENDING_CLAIMS'}
                loading={actionLoadingId === request.id}
                onApprove={() => approveClaim(request.id, request.itemId, request.requesterId)}
                onReject={() => rejectClaim(request.id)}
                onPress={() => navigation.navigate('ItemDetail', { itemId: request.itemId })}
              />
            );
          }}
          ListEmptyComponent={(
            activeTab === 'MY_ITEMS' ? (
              <EmptyState
                title="No reports yet"
                subtitle="Your posted items will appear here in real time."
                variant="neutral"
                label="TAM"
                actionLabel="Create your first report"
                onActionPress={() => navigation.navigate('Report')}
              />
            ) : activeTab === 'I_AM_CLAIMING' ? (
              <EmptyState
                title="No claim requests yet"
                subtitle="When you request to claim an item, it will appear here."
                variant="search"
                label="FIND"
              />
            ) : (
              <EmptyState
                title="No pending claims"
                subtitle="New claim requests for your items will appear here."
                variant="found"
                label="WAIT"
              />
            )
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    minHeight: 42,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: FontFamily.bodyBold,
  },
  tabTextActive: {
    color: Colors.accent,
  },
  countChip: {
    minWidth: 18,
    paddingHorizontal: Spacing.xs,
    height: 18,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.muted,
  },
  countChipActive: {
    backgroundColor: `${Colors.accent}40`,
  },
  countText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontFamily: FontFamily.bodyBold,
  },
  countTextActive: {
    color: Colors.accent,
  },
  listPadding: {
    padding: Spacing.lg,
    paddingBottom: 90,
  },
  errorBanner: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  emptyGrow: {
    flexGrow: 1,
  },
});