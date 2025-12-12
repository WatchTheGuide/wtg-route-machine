/**
 * Media Service Tests (Epic 8.10)
 * Tests for MediaService CRUD operations
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mediaService, MediaService } from './media.service.js';
import { db } from '../db/index.js';
import { media, users } from '../db/schema.js';
import fs from 'fs/promises';
import path from 'path';
import { MEDIA_CONFIG } from '../config/media.config.js';
import * as imageUtil from '../utils/image.util.js';
import bcrypt from 'bcrypt';

// Mock fs and image processing
vi.mock('fs/promises');
vi.mock('../utils/image.util.js', async () => {
  const actual = await vi.importActual('../utils/image.util.js');
  return {
    ...actual,
    processImage: vi.fn(),
    validateImageFile: vi.fn(),
  };
});

describe('MediaService (Epic 8.10)', () => {
  const mockUserId = 'user-123';
  const mockFile: Express.Multer.File = {
    fieldname: 'files',
    originalname: 'test-image.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024 * 500, // 500KB
    buffer: Buffer.from('fake-image-data'),
    stream: {} as any,
    destination: '',
    filename: '',
    path: '',
  };

  beforeEach(async () => {
    // Clean up media and users tables
    await db.delete(media);
    await db.delete(users);

    // Create test user (required for foreign key)
    await db.insert(users).values({
      id: mockUserId,
      email: 'test@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Mock file system operations
    vi.mocked(fs.mkdir).mockResolvedValue(undefined as any);
    vi.mocked(fs.unlink).mockResolvedValue(undefined);

    // Mock image processing
    vi.mocked(imageUtil.processImage).mockResolvedValue({
      optimizedPath: '/fake/path/abc123.jpg',
      thumbnailPath: '/fake/path/thumbnails/abc123-thumb.jpg',
      width: 1920,
      height: 1080,
      sizeBytes: 450000,
    });

    vi.mocked(imageUtil.validateImageFile).mockResolvedValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadMedia()', () => {
    it('should upload and process media file successfully', async () => {
      const input = {
        title: 'Test Image',
        altText: 'A test image',
        tags: ['test', 'upload'],
        contextType: 'tour' as const,
        contextId: 'tour-123',
      };

      const result = await mediaService.uploadMedia(
        mockFile,
        mockUserId,
        input
      );

      expect(result).toMatchObject({
        originalName: 'test-image.jpg',
        mimeType: 'image/jpeg',
        width: 1920,
        height: 1080,
        sizeBytes: 450000,
        title: 'Test Image',
        altText: 'A test image',
        tags: ['test', 'upload'],
        contextType: 'tour',
        contextId: 'tour-123',
        uploadedBy: mockUserId,
      });

      expect(result.id).toBeDefined();
      expect(result.filename).toMatch(/\.jpg$/);
      expect(result.url).toMatch(/^\/uploads\//);
      expect(result.thumbnailUrl).toMatch(/^\/uploads\/thumbnails\//);
    });

    it('should throw error when user quota exceeded', async () => {
      // Create mock media that exceeds quota
      await db.insert(media).values({
        filename: 'existing.jpg',
        originalName: 'existing.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: MEDIA_CONFIG.userQuotaBytes, // Exactly at limit
        width: 1920,
        height: 1080,
        url: '/uploads/existing.jpg',
        thumbnailUrl: '/uploads/thumbnails/existing-thumb.jpg',
        uploadedBy: mockUserId,
      });

      await expect(
        mediaService.uploadMedia(mockFile, mockUserId, {})
      ).rejects.toThrow('User quota exceeded (1GB limit)');
    });

    it('should upload without optional metadata', async () => {
      const result = await mediaService.uploadMedia(mockFile, mockUserId, {});

      expect(result.title).toBeNull();
      expect(result.altText).toBeNull();
      expect(result.tags).toEqual([]);
      expect(result.contextType).toBeNull();
      expect(result.contextId).toBeNull();
    });
  });

  describe('getMediaList()', () => {
    beforeEach(async () => {
      // Seed test data
      await db.insert(media).values([
        {
          filename: 'image1.jpg',
          originalName: 'Image 1',
          mimeType: 'image/jpeg',
          sizeBytes: 100000,
          width: 1920,
          height: 1080,
          url: '/uploads/image1.jpg',
          thumbnailUrl: '/uploads/thumbnails/image1-thumb.jpg',
          title: 'First Image',
          altText: 'Alt text 1',
          tags: JSON.stringify(['tag1', 'tag2']),
          contextType: 'tour',
          contextId: 'tour-1',
          uploadedBy: mockUserId,
        },
        {
          filename: 'image2.jpg',
          originalName: 'Image 2',
          mimeType: 'image/jpeg',
          sizeBytes: 200000,
          width: 1920,
          height: 1080,
          url: '/uploads/image2.jpg',
          thumbnailUrl: '/uploads/thumbnails/image2-thumb.jpg',
          title: 'Second Image',
          altText: 'Alt text 2',
          tags: JSON.stringify(['tag2', 'tag3']),
          contextType: 'poi',
          contextId: 'poi-1',
          uploadedBy: mockUserId,
        },
        {
          filename: 'image3.jpg',
          originalName: 'Image 3',
          mimeType: 'image/jpeg',
          sizeBytes: 150000,
          width: 1920,
          height: 1080,
          url: '/uploads/image3.jpg',
          thumbnailUrl: '/uploads/thumbnails/image3-thumb.jpg',
          title: 'Third Image',
          altText: null,
          tags: JSON.stringify(['tag1']),
          contextType: null,
          contextId: null,
          uploadedBy: mockUserId,
        },
      ]);
    });

    it('should return all media with default pagination', async () => {
      const result = await mediaService.getMediaList({
        limit: 50,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result.media).toHaveLength(3);
      expect(result.total).toBe(3);
    });

    it('should filter by tags (OR search)', async () => {
      const result = await mediaService.getMediaList({
        tags: ['tag1'],
        limit: 50,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result.media).toHaveLength(2);
      expect(result.media.some((m) => m.title === 'First Image')).toBe(true);
      expect(result.media.some((m) => m.title === 'Third Image')).toBe(true);
    });

    it('should filter by contextType', async () => {
      const result = await mediaService.getMediaList({
        contextType: 'tour',
        limit: 50,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result.media).toHaveLength(1);
      expect(result.media[0].title).toBe('First Image');
    });

    it('should search by title/altText/filename', async () => {
      const result = await mediaService.getMediaList({
        search: 'Second',
        limit: 50,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result.media).toHaveLength(1);
      expect(result.media[0].title).toBe('Second Image');
    });

    it('should paginate results correctly', async () => {
      const page1 = await mediaService.getMediaList({
        limit: 2,
        offset: 0,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      const page2 = await mediaService.getMediaList({
        limit: 2,
        offset: 2,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(page1.media).toHaveLength(2);
      expect(page2.media).toHaveLength(1);
      expect(page1.total).toBe(3);
      expect(page2.total).toBe(3);
    });

    it('should sort by sizeBytes ascending', async () => {
      const result = await mediaService.getMediaList({
        limit: 50,
        offset: 0,
        sortBy: 'sizeBytes',
        sortOrder: 'asc',
      });

      expect(result.media[0].sizeBytes).toBe(100000);
      expect(result.media[1].sizeBytes).toBe(150000);
      expect(result.media[2].sizeBytes).toBe(200000);
    });
  });

  describe('getMediaById()', () => {
    it('should return media when found', async () => {
      const [inserted] = await db
        .insert(media)
        .values({
          filename: 'test.jpg',
          originalName: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 100000,
          width: 1920,
          height: 1080,
          url: '/uploads/test.jpg',
          thumbnailUrl: '/uploads/thumbnails/test-thumb.jpg',
          uploadedBy: mockUserId,
        })
        .returning();

      const result = await mediaService.getMediaById(inserted.id);

      expect(result).toMatchObject({
        id: inserted.id,
        filename: 'test.jpg',
        originalName: 'test.jpg',
      });
    });

    it('should return null when not found', async () => {
      const result = await mediaService.getMediaById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('updateMedia()', () => {
    it('should update metadata successfully', async () => {
      const [inserted] = await db
        .insert(media)
        .values({
          filename: 'test.jpg',
          originalName: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 100000,
          width: 1920,
          height: 1080,
          url: '/uploads/test.jpg',
          thumbnailUrl: '/uploads/thumbnails/test-thumb.jpg',
          title: 'Old Title',
          uploadedBy: mockUserId,
        })
        .returning();

      const updated = await mediaService.updateMedia(inserted.id, {
        title: 'New Title',
        altText: 'New alt text',
        tags: ['new', 'tags'],
      });

      expect(updated.title).toBe('New Title');
      expect(updated.altText).toBe('New alt text');
      expect(updated.tags).toEqual(['new', 'tags']);
    });

    it('should throw error when media not found', async () => {
      await expect(
        mediaService.updateMedia('non-existent-id', { title: 'New' })
      ).rejects.toThrow('Media not found');
    });
  });

  describe('deleteMedia()', () => {
    it('should delete media and files successfully', async () => {
      const [inserted] = await db
        .insert(media)
        .values({
          filename: 'test.jpg',
          originalName: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 100000,
          width: 1920,
          height: 1080,
          url: '/uploads/test.jpg',
          thumbnailUrl: '/uploads/thumbnails/test-thumb.jpg',
          uploadedBy: mockUserId,
        })
        .returning();

      await mediaService.deleteMedia(inserted.id);

      // Verify DB deletion
      const found = await mediaService.getMediaById(inserted.id);
      expect(found).toBeNull();

      // Verify file deletion attempts
      expect(fs.unlink).toHaveBeenCalledTimes(2);
    });

    it('should throw error when media not found', async () => {
      await expect(mediaService.deleteMedia('non-existent-id')).rejects.toThrow(
        'Media not found'
      );
    });

    it('should not throw if file deletion fails', async () => {
      const [inserted] = await db
        .insert(media)
        .values({
          filename: 'test.jpg',
          originalName: 'test.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 100000,
          width: 1920,
          height: 1080,
          url: '/uploads/test.jpg',
          thumbnailUrl: '/uploads/thumbnails/test-thumb.jpg',
          uploadedBy: mockUserId,
        })
        .returning();

      vi.mocked(fs.unlink).mockRejectedValue(new Error('File not found'));

      // Should not throw - file deletion errors are caught
      await expect(
        mediaService.deleteMedia(inserted.id)
      ).resolves.not.toThrow();
    });
  });

  describe('checkUserQuota()', () => {
    it('should return true when under quota', async () => {
      await db.insert(media).values({
        filename: 'small.jpg',
        originalName: 'small.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 1024 * 1024, // 1MB
        width: 1920,
        height: 1080,
        url: '/uploads/small.jpg',
        thumbnailUrl: '/uploads/thumbnails/small-thumb.jpg',
        uploadedBy: mockUserId,
      });

      // Access private method via type assertion
      const service = mediaService as any;
      const hasQuota = await service.checkUserQuota(mockUserId);

      expect(hasQuota).toBe(true);
    });

    it('should return false when at or over quota', async () => {
      await db.insert(media).values({
        filename: 'large.jpg',
        originalName: 'large.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: MEDIA_CONFIG.userQuotaBytes,
        width: 1920,
        height: 1080,
        url: '/uploads/large.jpg',
        thumbnailUrl: '/uploads/thumbnails/large-thumb.jpg',
        uploadedBy: mockUserId,
      });

      const service = mediaService as any;
      const hasQuota = await service.checkUserQuota(mockUserId);

      expect(hasQuota).toBe(false);
    });
  });
});
