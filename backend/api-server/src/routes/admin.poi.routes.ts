/**
 * Admin POI Routes - CRUD operations
 * GET    /api/admin/poi                  - List all POIs (with filters)
 * GET    /api/admin/poi/stats            - POI statistics
 * POST   /api/admin/poi/:cityId          - Create POI
 * PUT    /api/admin/poi/:cityId/:poiId   - Update POI
 * DELETE /api/admin/poi/:cityId/:poiId   - Delete POI
 * POST   /api/admin/poi/bulk-delete      - Bulk delete POIs
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  createPOI,
  updatePOI,
  deletePOI,
  cityExists,
  getPOI,
  getAllPOIs,
  getPOIStats,
  bulkDeletePOIs,
  loadCategories,
  getCities,
} from '../services/poi.service.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import type { POI, POICategory } from '../types/index.js';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Validation schemas
const LocalizedStringSchema = z.object({
  pl: z.string().min(1, 'Polish translation is required'),
  en: z.string().optional(),
  de: z.string().optional(),
  fr: z.string().optional(),
  uk: z.string().optional(),
});

const createPOISchema = z.object({
  name: LocalizedStringSchema,
  description: LocalizedStringSchema,
  coordinates: z.tuple([z.number(), z.number()]),
  category: z.enum([
    'landmark',
    'museum',
    'park',
    'restaurant',
    'viewpoint',
    'church',
  ]),
  imageUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  estimatedTime: z.number().optional(),
  openingHours: z.string().optional(),
  closedDays: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  ticketPrice: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const updatePOISchema = createPOISchema.partial();

/**
 * GET /api/admin/poi
 * List all POIs with optional filters
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { cityId, category, search, page = '1', limit = '50' } = req.query;

    const pois = getAllPOIs({
      cityId: cityId as string | undefined,
      category: category as POICategory | undefined,
      search: search as string | undefined,
    });

    // Pagination
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedPOIs = pois.slice(startIndex, endIndex);

    return res.json({
      pois: paginatedPOIs,
      total: pois.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(pois.length / limitNum),
    });
  } catch (error) {
    console.error('Error fetching POIs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/admin/poi/stats
 * Get POI statistics
 */
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = getPOIStats();
    const categories = loadCategories();
    const cities = getCities();

    return res.json({
      ...stats,
      categories,
      cities,
    });
  } catch (error) {
    console.error('Error fetching POI stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/admin/poi/bulk-delete
 * Bulk delete POIs
 */
router.post('/bulk-delete', async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Items array is required',
        code: 'INVALID_ITEMS',
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.cityId || !item.poiId) {
        return res.status(400).json({
          error: 'Each item must have cityId and poiId',
          code: 'INVALID_ITEM_FORMAT',
        });
      }
    }

    const result = bulkDeletePOIs(items);
    return res.json(result);
  } catch (error) {
    console.error('Error bulk deleting POIs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/admin/poi/:cityId
 * Create a new POI
 */
router.post('/:cityId', async (req: Request, res: Response) => {
  try {
    const { cityId } = req.params;

    if (!cityExists(cityId)) {
      return res.status(404).json({
        error: `City '${cityId}' not found`,
        code: 'CITY_NOT_FOUND',
      });
    }

    const validation = createPOISchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    const newPOI = createPOI(cityId, validation.data as Omit<POI, 'id'>);
    return res.status(201).json(newPOI);
  } catch (error) {
    console.error('Error creating POI:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/admin/poi/:cityId/:poiId
 * Update an existing POI
 */
router.put('/:cityId/:poiId', async (req: Request, res: Response) => {
  try {
    const { cityId, poiId } = req.params;

    if (!cityExists(cityId)) {
      return res.status(404).json({
        error: `City '${cityId}' not found`,
        code: 'CITY_NOT_FOUND',
      });
    }

    const validation = updatePOISchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors,
      });
    }

    const updatedPOI = updatePOI(cityId, poiId, validation.data);
    if (!updatedPOI) {
      return res.status(404).json({
        error: 'POI not found',
        code: 'POI_NOT_FOUND',
      });
    }

    return res.json(updatedPOI);
  } catch (error) {
    console.error('Error updating POI:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/admin/poi/:cityId/:poiId
 * Delete a POI
 */
router.delete('/:cityId/:poiId', async (req: Request, res: Response) => {
  try {
    const { cityId, poiId } = req.params;

    if (!cityExists(cityId)) {
      return res.status(404).json({
        error: `City '${cityId}' not found`,
        code: 'CITY_NOT_FOUND',
      });
    }

    const success = deletePOI(cityId, poiId);
    if (!success) {
      return res.status(404).json({
        error: 'POI not found',
        code: 'POI_NOT_FOUND',
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting POI:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
