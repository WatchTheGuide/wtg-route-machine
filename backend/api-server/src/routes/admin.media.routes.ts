import { Router } from 'express';
import multer from 'multer';
import { mediaService } from '../services/media.service.js';
import {
  authMiddleware,
  editorOrAdmin,
} from '../middleware/auth.middleware.js';
import { adminCrudLimiter } from '../middleware/rate-limit.middleware.js';
import { MEDIA_CONFIG } from '../config/media.config.js';
import {
  uploadMediaSchema,
  updateMediaSchema,
  mediaFiltersSchema,
} from '../types/media.types.js';
import { validateImageFile } from '../utils/image.util.js';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MEDIA_CONFIG.maxFileSize,
    files: MEDIA_CONFIG.maxFilesPerUpload,
  },
  fileFilter: (_req, file, cb) => {
    if (MEDIA_CONFIG.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images allowed.'));
    }
  },
});

// All routes require authentication
router.use(authMiddleware);
router.use(editorOrAdmin);

/**
 * POST /api/admin/media/upload
 * Upload one or multiple images
 */
router.post(
  '/upload',
  adminCrudLimiter,
  upload.array('files', MEDIA_CONFIG.maxFilesPerUpload),
  async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files provided' });
      }

      // Validate and sanitize metadata
      const sanitizeText = (text: string | undefined): string | undefined => {
        if (!text) return undefined;
        // Remove HTML tags and limit to 200 chars
        return text
          .replace(/<[^>]*>/g, '')
          .slice(0, 200)
          .trim();
      };

      const input = uploadMediaSchema.parse({
        title: sanitizeText(req.body.title),
        altText: sanitizeText(req.body.altText),
        tags: req.body.tags
          ? req.body.tags.split(',').map((t: string) => t.trim())
          : [],
        contextType: req.body.contextType,
        contextId: req.body.contextId,
      });

      // Validate each file (magic bytes)
      for (const file of files) {
        const isValid = await validateImageFile(file.buffer);
        if (!isValid) {
          return res
            .status(400)
            .json({ error: `Invalid image file: ${file.originalname}` });
        }
      }

      // Process uploads in parallel
      const uploadedMedia = await Promise.all(
        files.map((file) =>
          mediaService.uploadMedia(file, req.user!.userId, input)
        )
      );

      res.status(201).json({ media: uploadedMedia });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message || 'Upload failed' });
    }
  }
);

/**
 * GET /api/admin/media
 * List media with filters
 */
router.get('/', async (req, res) => {
  try {
    const filters = mediaFiltersSchema.parse(req.query);
    const result = await mediaService.getMediaList(filters);

    res.json({
      media: result.media,
      total: result.total,
      hasMore: result.media.length + filters.offset < result.total,
    });
  } catch (error: any) {
    console.error('Get media list error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch media' });
  }
});

/**
 * GET /api/admin/media/:id
 * Get single media
 */
router.get('/:id', async (req, res) => {
  try {
    const mediaItem = await mediaService.getMediaById(req.params.id);
    if (!mediaItem) {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.json({ media: mediaItem });
  } catch (error: any) {
    console.error('Get media error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch media' });
  }
});

/**
 * PUT /api/admin/media/:id
 * Update metadata
 */
router.put('/:id', adminCrudLimiter, async (req, res) => {
  try {
    // Sanitize text inputs to prevent XSS
    const sanitizeText = (text: string | undefined): string | undefined => {
      if (!text) return undefined;
      // Remove HTML tags and limit to 200 chars
      return text
        .replace(/<[^>]*>/g, '')
        .slice(0, 200)
        .trim();
    };

    const input = updateMediaSchema.parse({
      title: sanitizeText(req.body.title),
      altText: sanitizeText(req.body.altText),
      tags: req.body.tags,
    });

    const updated = await mediaService.updateMedia(req.params.id, input);
    res.json({ media: updated });
  } catch (error: any) {
    console.error('Update media error:', error);
    res.status(500).json({ error: error.message || 'Failed to update media' });
  }
});

/**
 * DELETE /api/admin/media/:id
 * Delete media
 */
router.delete('/:id', adminCrudLimiter, async (req, res) => {
  try {
    await mediaService.deleteMedia(req.params.id);
    res.json({ message: 'Media deleted successfully' });
  } catch (error: any) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete media' });
  }
});

export default router;
