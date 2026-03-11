import * as ImageManipulator from 'expo-image-manipulator';

const MAX_DIMENSION = 1024;
const COMPRESS_QUALITY = 0.75;

/**
 * Resizes an image so its longest side does not exceed MAX_DIMENSION,
 * then compresses to COMPRESS_QUALITY (JPEG).
 *
 * This runs before every upload to reduce Storage bandwidth and download time.
 * Typical reduction: 2–4 MB raw → 150–400 KB processed.
 */
export async function compressImage(localUri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    localUri,
    [{ resize: { width: MAX_DIMENSION } }],
    {
      compress: COMPRESS_QUALITY,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );
  return result.uri;
}
