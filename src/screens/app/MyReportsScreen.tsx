import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AlertCircle, Plus } from 'lucide-react-native';
import type { AppStackParamList } from '../../navigation/types';
import ItemCard from '../../components/ItemCard';
import { ItemCardSkeleton } from '../../components/Skeleton';
import TamarawBadge from '../../components/TamarawBadge';
import { useMyItems } from '../../hooks/useMyItems';
import { Colors } from '../../theme/colors';
import { FontFamily } from '../../theme/typography';
import { Radius, Shadow, Spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<AppStackParamList, 'MyReports'>;

export default function MyReportsScreen({ navigation }: Props) {
  const { items, loading, error } = useMyItems();

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorBanner}>
          <AlertCircle size={15} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.listPadding}>
          {[...Array(3)].map((_, i) => <ItemCardSkeleton key={i} />)}
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listPadding, items.length === 0 && styles.emptyGrow]}
          showsVerticalScrollIndicator={false}
          refreshControl={(
            <RefreshControl
              refreshing={false}
              onRefresh={() => {}}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          )}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
            />
          )}
          ListEmptyComponent={(
            <View style={styles.emptyWrap}>
              <TamarawBadge size={84} variant="neutral" label="TAM" />
              <Text style={styles.emptyTitle}>No reports yet</Text>
              <Text style={styles.emptySub}>Your posted items will appear here in real time.</Text>
              <TouchableOpacity
                style={styles.cta}
                onPress={() => navigation.navigate('Report')}
                activeOpacity={0.86}
              >
                <Plus color={Colors.primary} size={20} strokeWidth={2.7} />
                <Text style={styles.ctaText}>Create your first report</Text>
              </TouchableOpacity>
            </View>
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
  listPadding: {
    padding: Spacing.lg,
    paddingBottom: 90,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    backgroundColor: '#FEE2E2',
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  errorText: {
    flex: 1,
    color: Colors.error,
    fontSize: 13,
    fontFamily: FontFamily.bodySemiBold,
  },
  emptyGrow: {
    flexGrow: 1,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 34,
    paddingVertical: 50,
  },
  emptyTitle: {
    marginTop: Spacing.xl,
    fontSize: 22,
    color: Colors.primary,
    fontFamily: FontFamily.displayBold,
    textAlign: 'center',
  },
  emptySub: {
    marginTop: Spacing.sm,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
    fontFamily: FontFamily.bodySemiBold,
    textAlign: 'center',
  },
  cta: {
    marginTop: Spacing.xl,
    height: 50,
    borderRadius: Radius.md,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadow.card,
  },
  ctaText: {
    fontSize: 15,
    color: Colors.primary,
    fontFamily: FontFamily.displaySemiBold,
  },
});