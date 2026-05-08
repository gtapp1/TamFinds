import { useState, useEffect } from 'react';
import { subscribeToItem, updateItemStatus } from '../api/itemsService';
import { getUserById } from '../api/usersService';
import {
  approveClaimRequest,
  createClaimRequest,
  rejectClaimRequest,
  subscribePendingClaimRequests,
} from '../api/claimRequestsService';
import { auth } from '../api/firebaseConfig';
import type { ClaimRequest, LostFoundItem, UserProfile } from '../types';

interface ItemDetailState {
  item: LostFoundItem | null;
  reporter: UserProfile | null;
  loading: boolean;
  error: string | null;
  /** True when the current user is the original reporter */
  isOwner: boolean;
  claiming: boolean;
  requestingClaim: boolean;
  pendingRequests: ClaimRequest[];
  hasRequested: boolean;
}

interface ItemDetailActions {
  markAsClaimed: () => Promise<void>;
  requestClaim: () => Promise<void>;
  approveRequest: (requestId: string, requesterId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
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
  const [requestingClaim, setRequestingClaim] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<ClaimRequest[]>([]);

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

  // Realtime pending claim requests for this item
  useEffect(() => {
    if (!item?.id || item.status !== 'FOUND') {
      setPendingRequests([]);
      return;
    }

    const unsubscribe = subscribePendingClaimRequests(
      item.id,
      (requests) => setPendingRequests(requests),
      (err) => setError(err.message),
    );

    return unsubscribe;
  }, [item?.id, item?.status]);

  const isOwner = !!auth.currentUser && auth.currentUser.uid === item?.reporterId;
  const hasRequested = pendingRequests.some((r) => r.requesterId === auth.currentUser?.uid);

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

  const requestClaim = async () => {
    if (!item || item.status !== 'FOUND' || requestingClaim || !auth.currentUser || isOwner) return;

    const currentUser = auth.currentUser;
    setRequestingClaim(true);
    try {
      await createClaimRequest({
        itemId: item.id,
        reporterId: item.reporterId,
        requesterId: currentUser.uid,
        requesterName: currentUser.displayName ?? 'TamFinds User',
        requesterEmail: currentUser.email ?? 'unknown@feuroosevelt.edu.ph',
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to submit claim request.');
    } finally {
      setRequestingClaim(false);
    }
  };

  const approveRequest = async (requestId: string, requesterId: string) => {
    if (!item || item.status !== 'FOUND' || !auth.currentUser || !isOwner || claiming) return;
    setClaiming(true);
    try {
      await approveClaimRequest({
        claimRequestId: requestId,
        itemId: item.id,
        reviewerUid: auth.currentUser.uid,
        requesterUid: requesterId,
      });
      await updateItemStatus(item.id, 'CLAIMED', requesterId);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to approve claim request.');
    } finally {
      setClaiming(false);
    }
  };

  const rejectRequest = async (requestId: string) => {
    if (!item || item.status !== 'FOUND' || !auth.currentUser || !isOwner || claiming) return;
    setClaiming(true);
    try {
      await rejectClaimRequest({
        claimRequestId: requestId,
        reviewerUid: auth.currentUser.uid,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to reject claim request.');
    } finally {
      setClaiming(false);
    }
  };

  return {
    item,
    reporter,
    loading,
    error,
    isOwner,
    claiming,
    requestingClaim,
    pendingRequests,
    hasRequested,
    markAsClaimed,
    requestClaim,
    approveRequest,
    rejectRequest,
  };
}
