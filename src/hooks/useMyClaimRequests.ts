import { useEffect, useMemo, useState } from 'react';
import { auth } from '../api/firebaseConfig';
import {
  approveClaimRequest,
  rejectClaimRequest,
  subscribeClaimRequestsByReporter,
  subscribeClaimRequestsByRequester,
} from '../api/claimRequestsService';
import { getItemById, subscribeToItemsByReporter, updateItemStatus } from '../api/itemsService';
import type { ClaimRequest, LostFoundItem } from '../types';

export type MyReportsTab = 'MY_ITEMS' | 'I_AM_CLAIMING' | 'PENDING_CLAIMS';

export interface ClaimRequestWithItem extends ClaimRequest {
  itemTitle?: string;
  itemCategory?: string;
  itemStatus?: string;
}

interface UseMyClaimRequestsState {
  myItems: LostFoundItem[];
  myClaims: ClaimRequestWithItem[];
  pendingClaimsForMyItems: ClaimRequestWithItem[];
  loading: boolean;
  error: string | null;
  actionLoadingId: string | null;
  refreshTick: number;
  approveClaim: (claimRequestId: string, itemId: string, requesterId: string) => Promise<void>;
  rejectClaim: (claimRequestId: string) => Promise<void>;
}

export function useMyClaimRequests(): UseMyClaimRequestsState {
  const [myItems, setMyItems] = useState<LostFoundItem[]>([]);
  const [myClaims, setMyClaims] = useState<ClaimRequestWithItem[]>([]);
  const [claimsOnMyItems, setClaimsOnMyItems] = useState<ClaimRequestWithItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setError('You must be signed in to view claim requests.');
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubItems = subscribeToItemsByReporter(
      uid,
      (items) => {
        setMyItems(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    const unsubMyClaims = subscribeClaimRequestsByRequester(
      uid,
      (requests) => {
        setMyClaims(requests);
      },
      (err) => setError(err.message),
    );

    const unsubClaimsOnMyItems = subscribeClaimRequestsByReporter(
      uid,
      (requests) => {
        setClaimsOnMyItems(requests);
      },
      (err) => setError(err.message),
    );

    return () => {
      unsubItems();
      unsubMyClaims();
      unsubClaimsOnMyItems();
    };
  }, []);

  const allReferencedItemIds = useMemo(() => {
    const ids = new Set<string>();
    for (const r of myClaims) ids.add(r.itemId);
    for (const r of claimsOnMyItems) ids.add(r.itemId);
    return Array.from(ids);
  }, [myClaims, claimsOnMyItems]);

  useEffect(() => {
    if (allReferencedItemIds.length === 0) return;

    let cancelled = false;

    (async () => {
      try {
        const itemPairs = await Promise.all(
          allReferencedItemIds.map(async (id) => {
            const item = await getItemById(id);
            return [id, item] as const;
          }),
        );

        if (cancelled) return;

        const itemMap = new Map(itemPairs);

        setMyClaims((prev) =>
          prev.map((r) => {
            const linked = itemMap.get(r.itemId);
            return {
              ...r,
              itemTitle: linked?.title ?? 'Unknown item',
              itemCategory: linked?.category,
              itemStatus: linked?.status,
            };
          }),
        );

        setClaimsOnMyItems((prev) =>
          prev.map((r) => {
            const linked = itemMap.get(r.itemId);
            return {
              ...r,
              itemTitle: linked?.title ?? 'Unknown item',
              itemCategory: linked?.category,
              itemStatus: linked?.status,
            };
          }),
        );
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load claim-linked items.');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [allReferencedItemIds, refreshTick]);

  const approveClaim = async (claimRequestId: string, itemId: string, requesterId: string) => {
    const reviewerUid = auth.currentUser?.uid;
    if (!reviewerUid) return;

    setActionLoadingId(claimRequestId);
    try {
      await approveClaimRequest({
        claimRequestId,
        itemId,
        reviewerUid,
        requesterUid: requesterId,
      });
      await updateItemStatus(itemId, 'CLAIMED', requesterId);
      setRefreshTick((n) => n + 1);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to approve claim request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const rejectClaim = async (claimRequestId: string) => {
    const reviewerUid = auth.currentUser?.uid;
    if (!reviewerUid) return;

    setActionLoadingId(claimRequestId);
    try {
      await rejectClaimRequest({ claimRequestId, reviewerUid });
      setRefreshTick((n) => n + 1);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to reject claim request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingClaimsForMyItems = useMemo(
    () => claimsOnMyItems.filter((r) => r.status === 'PENDING'),
    [claimsOnMyItems],
  );

  return {
    myItems,
    myClaims,
    pendingClaimsForMyItems,
    loading,
    error,
    actionLoadingId,
    refreshTick,
    approveClaim,
    rejectClaim,
  };
}
