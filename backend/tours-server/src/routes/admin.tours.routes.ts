/**
 * Admin Tours Routes - CRUD operations
 * POST   /api/admin/tours          - Create tour
 * GET    /api/admin/tours          - Get all tours (with filters)
 * GET    /api/admin/tours/stats    - Get dashboard stats
 * GET    /api/admin/tours/:id      - Get tour by ID
 * PUT    /api/admin/tours/:id      - Update tour
 * DELETE /api/admin/tours/:id      - Delete tour
 * POST   /api/admin/tours/:id/duplicate - Duplicate tour
 * POST   /api/admin/tours/:id/publish   - Publish tour
 * POST   /api/admin/tours/:id/archive   - Archive tour
 * POST   /api/admin/tours/bulk-delete   - Bulk delete
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { adminToursService } from '../services/admin.tours.service.js';
import { authMiddleware, editorOrAdmin, adminOnly } from '../middleware/index.js';
import type { AdminTour, AdminTourSummary, ErrorResponse } from '../types/index.js';

const router = Router();

// All admin routes require authentication
router.use(authMiddleware);

// Validation schemas
const localizedStringSchema = z.object({
  pl: z.string().min(1),
  en: z.string().min(1),
  de: z.string().min(1),
  fr: z.string().min(1),
  uk: z.string().min(1),
});

const poiSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  coordinate: z.tuple([z.number(), z.number()]),
  address: z.string(),
  imageUrl: z.string().optional(),
  openingHours: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
});

const tourInputSchema = z.object({
  cityId: z.string().min(1),
  name: localizedStringSchema,
  description: localizedStringSchema,
  category: z.enum(['history', 'architecture', 'nature', 'food', 'art', 'nightlife']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  distance: z.number().min(0),
  duration: z.number().min(0),
  imageUrl: z.string(),
  pois: z.array(poiSchema),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  featured: z.boolean().optional(),
});

const tourUpdateSchema = tourInputSchema.partial();

const bulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1),
});

/**
 * GET /api/admin/tours
 * Get all tours with optional filters
 */
router.get(
  '/',
  editorOrAdmin,
  async (req: Request, res: Response<{ tours: AdminTourSummary[] } | ErrorResponse>): Promise<void> => {
    try {
      const { cityId, status, category, difficulty, search } = req.query;

      const tours = await adminToursService.getAllTours({
        cityId: cityId as string | undefined,
        status: status as 'draft' | 'published' | 'archived' | undefined,
        category: category as string | undefined,
        difficulty: difficulty as string | undefined,
        search: search as string | undefined,
      });

      res.json({ tours });
    } catch (error) {
      console.error('Error fetching tours:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch tours',
      });
    }
  }
);

/**
 * GET /api/admin/tours/stats
 * Get dashboard statistics
 */
router.get(
  '/stats',
  editorOrAdmin,
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await adminToursService.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch statistics',
      });
    }
  }
);

/**
 * GET /api/admin/tours/cities
 * Get cities with tour counts
 */
router.get(
  '/cities',
  editorOrAdmin,
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const cities = await adminToursService.getCities();
      res.json({ cities });
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch cities',
      });
    }
  }
);

/**
 * GET /api/admin/tours/:id
 * Get tour by ID
 */
router.get(
  '/:id',
  editorOrAdmin,
  async (req: Request, res: Response<{ tour: AdminTour } | ErrorResponse>): Promise<void> => {
    try {
      const { id } = req.params;
      const tour = await adminToursService.getTourById(id);

      if (!tour) {
        res.status(404).json({
          error: 'Not Found',
          message: `Tour not found: ${id}`,
        });
        return;
      }

      res.json({ tour });
    } catch (error) {
      console.error('Error fetching tour:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch tour',
      });
    }
  }
);

/**
 * POST /api/admin/tours
 * Create new tour
 */
router.post(
  '/',
  editorOrAdmin,
  async (req: Request, res: Response<{ tour: AdminTour } | ErrorResponse>): Promise<void> => {
    try {
      const validation = tourInputSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          message: validation.error.errors.map((e) => e.message).join(', '),
        });
        return;
      }

      const tour = await adminToursService.createTour(validation.data);
      res.status(201).json({ tour });
    } catch (error) {
      console.error('Error creating tour:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create tour',
      });
    }
  }
);

/**
 * PUT /api/admin/tours/:id
 * Update existing tour
 */
router.put(
  '/:id',
  editorOrAdmin,
  async (req: Request, res: Response<{ tour: AdminTour } | ErrorResponse>): Promise<void> => {
    try {
      const { id } = req.params;

      const validation = tourUpdateSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          message: validation.error.errors.map((e) => e.message).join(', '),
        });
        return;
      }

      const tour = await adminToursService.updateTour(id, validation.data);

      if (!tour) {
        res.status(404).json({
          error: 'Not Found',
          message: `Tour not found: ${id}`,
        });
        return;
      }

      res.json({ tour });
    } catch (error) {
      console.error('Error updating tour:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update tour',
      });
    }
  }
);

/**
 * DELETE /api/admin/tours/:id
 * Delete tour
 */
router.delete(
  '/:id',
  adminOnly,
  async (req: Request, res: Response<{ success: boolean } | ErrorResponse>): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await adminToursService.deleteTour(id);

      if (!deleted) {
        res.status(404).json({
          error: 'Not Found',
          message: `Tour not found: ${id}`,
        });
        return;
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting tour:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to delete tour',
      });
    }
  }
);

/**
 * POST /api/admin/tours/bulk-delete
 * Delete multiple tours
 */
router.post(
  '/bulk-delete',
  adminOnly,
  async (req: Request, res: Response<{ deleted: number } | ErrorResponse>): Promise<void> => {
    try {
      const validation = bulkDeleteSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          message: validation.error.errors.map((e) => e.message).join(', '),
        });
        return;
      }

      const result = await adminToursService.bulkDelete(validation.data.ids);
      res.json(result);
    } catch (error) {
      console.error('Error bulk deleting tours:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to delete tours',
      });
    }
  }
);

/**
 * POST /api/admin/tours/:id/duplicate
 * Duplicate a tour
 */
router.post(
  '/:id/duplicate',
  editorOrAdmin,
  async (req: Request, res: Response<{ tour: AdminTour } | ErrorResponse>): Promise<void> => {
    try {
      const { id } = req.params;
      const tour = await adminToursService.duplicateTour(id);

      if (!tour) {
        res.status(404).json({
          error: 'Not Found',
          message: `Tour not found: ${id}`,
        });
        return;
      }

      res.status(201).json({ tour });
    } catch (error) {
      console.error('Error duplicating tour:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to duplicate tour',
      });
    }
  }
);

/**
 * POST /api/admin/tours/:id/publish
 * Publish a tour
 */
router.post(
  '/:id/publish',
  editorOrAdmin,
  async (req: Request, res: Response<{ tour: AdminTour } | ErrorResponse>): Promise<void> => {
    try {
      const { id } = req.params;
      const tour = await adminToursService.publishTour(id);

      if (!tour) {
        res.status(404).json({
          error: 'Not Found',
          message: `Tour not found: ${id}`,
        });
        return;
      }

      res.json({ tour });
    } catch (error) {
      console.error('Error publishing tour:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to publish tour',
      });
    }
  }
);

/**
 * POST /api/admin/tours/:id/archive
 * Archive a tour
 */
router.post(
  '/:id/archive',
  adminOnly,
  async (req: Request, res: Response<{ tour: AdminTour } | ErrorResponse>): Promise<void> => {
    try {
      const { id } = req.params;
      const tour = await adminToursService.archiveTour(id);

      if (!tour) {
        res.status(404).json({
          error: 'Not Found',
          message: `Tour not found: ${id}`,
        });
        return;
      }

      res.json({ tour });
    } catch (error) {
      console.error('Error archiving tour:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to archive tour',
      });
    }
  }
);

export default router;
