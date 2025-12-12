import { db } from '../db/index.js';
import { media } from '../db/schema.js';
import { eq, and, like, desc, asc, sql } from 'drizzle-orm';
import type {
  MediaFilters,
  MediaObject,
  UploadMediaInput,
  UpdateMediaInput,
} from '../types/media.types.js';
import { processImage } from '../utils/image.util.js';
import fs from 'fs/promises';
import path from 'path';
import { MEDIA_CONFIG } from '../config/media.config.js';
import crypto from 'crypto';

export class MediaService {
  /**
   * Upload and process media file
   */
  async uploadMedia(
    file: Express.Multer.File,
    userId: string,
    input: UploadMediaInput
  ): Promise<MediaObject> {
    // Check user quota
    const hasQuota = await this.checkUserQuota(userId);
    if (!hasQuota) {
      throw new Error('User quota exceeded (1GB limit)');
    }

    // Generate unique filename
    const ext = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${ext}`;

    // Process image (optimize + thumbnail)
    const processed = await processImage(file.buffer, filename);

    // Insert to database
    const [inserted] = await db
      .insert(media)
      .values({
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: processed.sizeBytes,
        width: processed.width,
        height: processed.height,
        url: `/uploads/${filename}`,
        thumbnailUrl: `/uploads/thumbnails/${filename.replace(
          /\.([^.]+)$/,
          '-thumb.$1'
        )}`,
        title: input.title || null,
        altText: input.altText || null,
        tags: JSON.stringify(input.tags || []),
        contextType: input.contextType || null,
        contextId: input.contextId || null,
        uploadedBy: userId,
      })
      .returning();

    return this.formatMediaObject(inserted);
  }

  /**
   * Get media list with filters
   */
  async getMediaList(
    filters: MediaFilters
  ): Promise<{ media: MediaObject[]; total: number }> {
    const conditions = [];

    // Filter by tags (OR search)
    if (filters.tags && filters.tags.length > 0) {
      const tagConditions = filters.tags.map((tag) =>
        like(media.tags, `%"${tag}"%`)
      );
      conditions.push(sql`(${sql.join(tagConditions, sql` OR `)})`);
    }

    // Filter by context
    if (filters.contextType) {
      conditions.push(eq(media.contextType, filters.contextType));
    }
    if (filters.contextId) {
      conditions.push(eq(media.contextId, filters.contextId));
    }

    // Search in title/altText/filename
    if (filters.search) {
      const searchPattern = `%${filters.search}%`;
      conditions.push(
        sql`(${like(media.title, searchPattern)} OR ${like(
          media.altText,
          searchPattern
        )} OR ${like(media.originalName, searchPattern)})`
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(media)
      .where(whereClause);

    // Get paginated results
    const orderBy =
      filters.sortOrder === 'asc'
        ? asc(media[filters.sortBy])
        : desc(media[filters.sortBy]);

    const results = await db
      .select()
      .from(media)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(filters.limit)
      .offset(filters.offset);

    return {
      media: results.map((row) => this.formatMediaObject(row)),
      total: count,
    };
  }

  /**
   * Get single media by ID
   */
  async getMediaById(id: string): Promise<MediaObject | null> {
    const [result] = await db
      .select()
      .from(media)
      .where(eq(media.id, id))
      .limit(1);

    return result ? this.formatMediaObject(result) : null;
  }

  /**
   * Update media metadata
   */
  async updateMedia(id: string, input: UpdateMediaInput): Promise<MediaObject> {
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (input.title !== undefined) updates.title = input.title;
    if (input.altText !== undefined) updates.altText = input.altText;
    if (input.tags !== undefined) updates.tags = JSON.stringify(input.tags);

    const [updated] = await db
      .update(media)
      .set(updates)
      .where(eq(media.id, id))
      .returning();

    if (!updated) {
      throw new Error('Media not found');
    }

    return this.formatMediaObject(updated);
  }

  /**
   * Delete media (file + DB record)
   */
  async deleteMedia(id: string): Promise<void> {
    const [mediaItem] = await db
      .select()
      .from(media)
      .where(eq(media.id, id))
      .limit(1);

    if (!mediaItem) {
      throw new Error('Media not found');
    }

    // Delete files
    const filePath = path.join(MEDIA_CONFIG.uploadsDir, mediaItem.filename);
    const thumbnailPath = path.join(
      MEDIA_CONFIG.thumbnailsDir,
      mediaItem.filename.replace(/\.([^.]+)$/, '-thumb.$1')
    );

    await Promise.all([
      fs.unlink(filePath).catch(() => {}),
      fs.unlink(thumbnailPath).catch(() => {}),
    ]);

    // Delete DB record
    await db.delete(media).where(eq(media.id, id));
  }

  /**
   * Check if user has available quota
   */
  private async checkUserQuota(userId: string): Promise<boolean> {
    const [{ total }] = await db
      .select({ total: sql<number>`COALESCE(SUM(${media.sizeBytes}), 0)` })
      .from(media)
      .where(eq(media.uploadedBy, userId));

    return total < MEDIA_CONFIG.userQuotaBytes;
  }

  /**
   * Format DB row to MediaObject
   */
  private formatMediaObject(row: any): MediaObject {
    return {
      ...row,
      tags: JSON.parse(row.tags || '[]'),
    };
  }
}

export const mediaService = new MediaService();
