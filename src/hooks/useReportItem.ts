import { useState } from 'react';
import { auth } from '../api/firebaseConfig';
import { uploadItemImage } from '../api/storageService';
import { createItem } from '../api/itemsService';
import type { ReportDraft, LostFoundItem } from '../types';

interface UseReportItemState {
  submitting: boolean;
  error: string | null;
}

interface UseReportItemActions {
  submitReport: (draft: ReportDraft) => Promise<string | null>;
  clearError: () => void;
}

/**
 * Orchestrates the full report submission:
 * 1. Upload image → get downloadUrl
 * 2. Write Firestore document with all fields
 * Returns the new item's document ID on success, null on failure.
 */
export function useReportItem(): UseReportItemState & UseReportItemActions {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReport = async (draft: ReportDraft): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) {
      setError('You must be signed in to report an item.');
      return null;
    }
    setSubmitting(true);
    setError(null);

    try {
      // Upload photo if one was selected; fall back gracefully if Storage is
      // unavailable or not yet configured (item still posts without an image).
      let imageUrl: string | undefined;
      if (draft.localImageUri) {
        try {
          const result = await uploadItemImage(draft.localImageUri, user.uid);
          imageUrl = result.downloadUrl;
        } catch {
          // Storage not set up or network issue — proceed without photo
          console.warn('[TamFinds] Image upload skipped:', 'Storage unavailable');
        }
      }

      const payload: Omit<LostFoundItem, 'id' | 'reportedAt'> = {
        title: draft.title.trim(),
        description: draft.description.trim(),
        location: draft.location.trim(),
        category: draft.category,
        status: draft.status,
        isAtSecurity: draft.isAtSecurity,
        reporterId: user.uid,
        ...(imageUrl ? { imageUrl } : {}),
      };

      const itemId = await createItem(payload);
      return itemId;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to submit report.';
      setError(message);
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const clearError = () => setError(null);

  return { submitting, error, submitReport, clearError };
}
