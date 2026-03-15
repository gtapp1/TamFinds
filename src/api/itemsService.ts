import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { LostFoundItem, NewItem, ItemStatus } from '../types';

const ITEMS_COLLECTION = 'items';

/**
 * Writes a new item document to Firestore.
 * `reportedAt` is always server-generated.
 * Returns the Firestore-assigned document ID.
 */
export async function createItem(payload: NewItem): Promise<string> {
  const docRef = await addDoc(collection(db, ITEMS_COLLECTION), {
    ...payload,
    reportedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Attaches a real-time listener to the items collection,
 * ordered newest-first. Returns the unsubscribe function.
 * (Used by the Home Feed in Phase 2.)
 */
export function subscribeToItems(
  onData: (items: LostFoundItem[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, ITEMS_COLLECTION),
    orderBy('reportedAt', 'desc'),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<LostFoundItem, 'id'>),
      }));
      onData(items);
    },
    (err) => onError?.(err),
  );
}

/**
 * Real-time listener for items posted by a specific reporter.
 * Used by the My Reports screen.
 */
export function subscribeToItemsByReporter(
  reporterId: string,
  onData: (items: LostFoundItem[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, ITEMS_COLLECTION),
    where('reporterId', '==', reporterId),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs
        .map((snap) => ({
          id: snap.id,
          ...(snap.data() as Omit<LostFoundItem, 'id'>),
        }))
        .sort((a, b) => (b.reportedAt?.seconds ?? 0) - (a.reportedAt?.seconds ?? 0));
      onData(items);
    },
    (err) => onError?.(err),
  );
}

/**
 * Attaches a real-time listener to a single item document.
 * Returns null in onData if the document does not exist.
 */
export function subscribeToItem(
  itemId: string,
  onData: (item: LostFoundItem | null) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, ITEMS_COLLECTION, itemId),
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      onData({ id: snap.id, ...(snap.data() as Omit<LostFoundItem, 'id'>) });
    },
    (err) => onError?.(err),
  );
}

/**
 * Updates the status of an item.
 * Only the reporter should be allowed to call this (enforced in the UI layer).
 */
export async function updateItemStatus(
  itemId: string,
  status: ItemStatus,
  claimedBy?: string,
): Promise<void> {
  await updateDoc(doc(db, ITEMS_COLLECTION, itemId), {
    status,
    ...(claimedBy ? { claimedBy } : {}),
  });
}
