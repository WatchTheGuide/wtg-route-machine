import sharp from 'sharp';
import { MEDIA_CONFIG } from '../config/media.config.js';
import fs from 'fs/promises';
import path from 'path';

export interface ProcessedImage {
  optimizedPath: string;
  thumbnailPath: string;
  width: number;
  height: number;
  sizeBytes: number;
}

/**
 * Process uploaded image: optimize original + generate thumbnail
 */
export async function processImage(
  buffer: Buffer,
  filename: string
): Promise<ProcessedImage> {
  const { uploadsDir, thumbnailsDir } = MEDIA_CONFIG;

  // Ensure directories exist
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.mkdir(thumbnailsDir, { recursive: true });

  const optimizedPath = path.join(uploadsDir, filename);
  const thumbnailFilename = filename.replace(/\.([^.]+)$/, '-thumb.$1');
  const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename);

  // Process optimized original
  const optimized = await sharp(buffer)
    .resize(MEDIA_CONFIG.maxImageDimension, MEDIA_CONFIG.maxImageDimension, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: MEDIA_CONFIG.jpegQuality, progressive: true })
    .toFile(optimizedPath);

  // Generate thumbnail
  await sharp(buffer)
    .resize(MEDIA_CONFIG.thumbnailSize, MEDIA_CONFIG.thumbnailSize, {
      fit: 'cover',
    })
    .jpeg({ quality: MEDIA_CONFIG.thumbnailQuality })
    .toFile(thumbnailPath);

  return {
    optimizedPath,
    thumbnailPath,
    width: optimized.width,
    height: optimized.height,
    sizeBytes: optimized.size,
  };
}

/**
 * Validate image file type (magic bytes check)
 */
export async function validateImageFile(buffer: Buffer): Promise<boolean> {
  try {
    const metadata = await sharp(buffer).metadata();
    return (
      !!metadata.format &&
      MEDIA_CONFIG.allowedMimeTypes.includes(`image/${metadata.format}`)
    );
  } catch {
    return false;
  }
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .toLowerCase();
}
