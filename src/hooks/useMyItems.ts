import { useEffect, useState } from 'react';
import { auth } from '../api/firebaseConfig';
import { subscribeToItemsByReporter } from '../api/itemsService';
import type { LostFoundItem } from '../types';

interface UseMyItemsState {
  items: LostFoundItem[];
  loading: boolean;
  error: string | null;
}

export function useMyItems(): UseMyItemsState {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setItems([]);
      setLoading(false);
      setError('You must be signed in to view your reports.');
      return;
    }

    const unsubscribe = subscribeToItemsByReporter(
      uid,
      (data) => {
        setItems(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { items, loading, error };
}