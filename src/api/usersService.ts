import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { UserProfile } from '../types';

/**
 * One-time fetch of a user profile by UID.
 * Returns null if the document does not exist.
 */
export async function getUserById(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...(snap.data() as Omit<UserProfile, 'uid'>) };
}
