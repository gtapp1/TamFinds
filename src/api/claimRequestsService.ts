import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { ClaimRequest } from '../types';

const CLAIMS_COLLECTION = 'claimRequests';

export async function createClaimRequest(input: {
  itemId: string;
  reporterId: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
}): Promise<void> {
  const requestId = `${input.itemId}_${input.requesterId}`;
  const existing = await getDoc(doc(db, CLAIMS_COLLECTION, requestId));

  if (existing.exists() && existing.data().status === 'PENDING') {
    throw new Error('You already have a pending claim request for this item.');
  }

  await setDoc(doc(db, CLAIMS_COLLECTION, requestId), {
    ...input,
    status: 'PENDING',
    createdAt: serverTimestamp(),
  });
}

export function subscribePendingClaimRequests(
  itemId: string,
  onData: (requests: ClaimRequest[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, CLAIMS_COLLECTION),
    where('itemId', '==', itemId),
  );

  return onSnapshot(
    q,
    (snap) => {
      const requests = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ClaimRequest, 'id'>),
      }))
      .filter((r) => r.status === 'PENDING')
      .sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0));
      onData(requests);
    },
    (err) => onError?.(err),
  );
}

export async function approveClaimRequest(input: {
  claimRequestId: string;
  itemId: string;
  reviewerUid: string;
  requesterUid: string;
}): Promise<void> {
  await updateDoc(doc(db, CLAIMS_COLLECTION, input.claimRequestId), {
    status: 'APPROVED',
    reviewedAt: serverTimestamp(),
    reviewedBy: input.reviewerUid,
  });

  await updateDoc(doc(db, 'items', input.itemId), {
    status: 'CLAIMED',
    claimedBy: input.requesterUid,
  });
}