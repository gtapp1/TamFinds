import { useState, useEffect } from 'react';
import { subscribeToItems } from '../api/itemsService';
import type { LostFoundItem, ItemStatus, ItemCategory } from '../types';

interface ItemsFilter {
  status?: ItemStatus;
  category?: ItemCategory;
}

interface UseItemsState {
  items: LostFoundItem[];
  loading: boolean;
  error: string | null;
}

/**
 * Subscribes to the Firestore items collection in real-time.
 * Cleans up the listener automatically on unmount.
 * Client-side filter keeps the single listener alive (avoids re-subscribing on tab change).
 */
export function useItems(filter?: ItemsFilter): UseItemsState {
  const [allItems, setAllItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToItems(
      (data) => {
        setAllItems(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  // Client-side filter — single listener, no extra reads
  const items = allItems.filter((item) => {
    if (filter?.status && item.status !== filter.status) return false;
    if (filter?.category && item.category !== filter.category) return false;
    return true;
  });

  return { items, loading, error };
}
