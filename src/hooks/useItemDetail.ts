import { useState, useEffect } from 'react';
import { subscribeToItem, updateItemStatus } from '../api/itemsService';
import { getUserById } from '../api/usersService';
import { auth } from '../api/firebaseConfig';
import type { LostFoundItem, UserProfile, ItemStatus } from '../types';

interface ItemDetailState {
  item: LostFoundItem | null;
  reporter: UserProfile | null;
  loading: boolean;
  error: string | null;
  /** True when the current user is the original reporter */
  isOwner: boolean;
  claiming: boolean;
}

interface ItemDetailActions {
  markAsClaimed: () => Promise<void>;
}

/**
 * Combines a real-time single-item listener with a one-time reporter profile fetch.
 * Re-fetches the reporter if reporterId changes (edge case: shouldn't happen in practice).
 */
export function useItemDetail(itemId: string): ItemDetailState & ItemDetailActions {
  const [item, setItem] = useState<LostFoundItem | null>(null);
  const [reporter, setReporter] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  // Real-time listener for the item document
  useEffect(() => {
    const unsubscribe = subscribeToItem(
      itemId,
      (data) => {
        setItem(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [itemId]);

  // One-time reporter profile fetch, triggered when reporterId becomes available
  useEffect(() => {
    if (!item?.reporterId) return;
    let cancelled = false;
    getUserById(item.reporterId).then((profile) => {
      if (!cancelled) setReporter(profile);
    });
    return () => { cancelled = true; };
  }, [item?.reporterId]);

  const isOwner = !!auth.currentUser && auth.currentUser.uid === item?.reporterId;

  const markAsClaimed = async () => {
    if (!item || claiming) return;
    setClaiming(true);
    try {
      await updateItemStatus(item.id, 'CLAIMED');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update status.');
    } finally {
      setClaiming(false);
    }
  };

  return { item, reporter, loading, error, isOwner, claiming, markAsClaimed };
}
