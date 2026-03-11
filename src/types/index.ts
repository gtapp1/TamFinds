import { Timestamp } from 'firebase/firestore';

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  /** true when the account email ends with @feuroosevelt.edu.ph */
  isSchoolVerified: boolean;
  createdAt: Timestamp;
}

// ─── Lost & Found Item ────────────────────────────────────────────────────────

export type ItemCategory = 'Electronics' | 'IDs' | 'Books' | 'Personal';

export type ItemStatus = 'LOST' | 'FOUND' | 'CLAIMED';

export interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  location: string;
  category: ItemCategory;
  status: ItemStatus;
  /** Reference to UserProfile.uid */
  reporterId: string;
  reportedAt: Timestamp;
  isAtSecurity: boolean;
}

// ─── API Helpers ──────────────────────────────────────────────────────────────

/** Firestore write payload — id and reportedAt are server-generated */
export type NewItem = Omit<LostFoundItem, 'id' | 'reportedAt'>;

/** In-memory form state used by ReportScreen before submission */
export interface ReportDraft {
  title: string;
  description: string;
  location: string;
  category: ItemCategory;
  status: ItemStatus;
  isAtSecurity: boolean;
  /** Local URI from expo-image-picker; null means no image selected yet */
  localImageUri: string | null;
}

/** Result returned from the image-upload service */
export interface UploadResult {
  downloadUrl: string;
  storagePath: string;
}
