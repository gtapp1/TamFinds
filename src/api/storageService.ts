import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig';
import { compressImage } from '../utils/imageCompression';
import type { UploadResult } from '../types';

/**
 * Uploads a local image URI to Firebase Storage.
 *
 * Path: items/{uid}/{timestamp}_{filename}
 * Security Rules should enforce: request.auth.uid == uid
 */
export async function uploadItemImage(
  localUri: string,
  uid: string,
): Promise<UploadResult> {
  // Compress to max 1024px / 75% JPEG before transmitting (~60-85% size reduction)
  const compressedUri = await compressImage(localUri);

  const response = await fetch(compressedUri);
  const blob = await response.blob();

  const filename = `${Date.now()}.jpg`;
  const storagePath = `items/${uid}/${filename}`;

  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, blob);

  const downloadUrl = await getDownloadURL(storageRef);

  return { downloadUrl, storagePath };
}
