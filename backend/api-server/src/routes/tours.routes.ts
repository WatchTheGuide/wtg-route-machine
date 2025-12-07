/**
 * Tours Routes (Public API)
 * GET /api/tours/cities - Get all cities with tour counts
 * GET /api/tours/:cityId - Get tours for a city
 * GET /api/tours/:cityId/search - Search tours
 * GET /api/tours/:cityId/:tourId - Get tour details
 */

import { Router, Request, Response } from 'express';
import { toursService } from '../services/tours.service.js';
import type {
  ToursCitiesResponse,
  ToursResponse,
  TourResponse,
  SearchToursResponse,
  ErrorResponse,
} from '../types/index.js';

const router = Router();

/**
 * GET /api/tours/cities
 * Get list of all cities with tour counts
 */
router.get(
  '/cities',
  async (_req: Request, res: Response<ToursCitiesResponse | ErrorResponse>) => {
    try {
      const cities = await toursService.getCities();
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
 * GET /api/tours/:cityId/search
 * Search tours by name or description
 * NOTE: Must be BEFORE /:cityId/:tourId to avoid conflict
 */
router.get(
  '/:cityId/search',
  async (req: Request, res: Response<SearchToursResponse | ErrorResponse>) => {
    try {
      const { cityId } = req.params;
      const query = (req.query.q as string) || '';

      if (!query) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Query parameter "q" is required',
        });
        return;
      }

      const tours = await toursService.searchTours(cityId, query);
      res.json({
        tours,
        query,
        count: tours.length,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith('Invalid city ID')
      ) {
        res.status(404).json({
          error: 'Not Found',
          message: error.message,
        });
      } else {
        console.error('Error searching tours:', error);
        res.status(500).json({
          error: 'Internal Server Error',
          message: 'Failed to search tours',
        });
      }
    }
  }
);

/**
 * GET /api/tours/:cityId
 * Get all tours for a specific city
 */
router.get(
  '/:cityId',
  async (req: Request, res: Response<ToursResponse | ErrorResponse>) => {
    try {
      const { cityId } = req.params;
      const tours = await toursService.getToursByCity(cityId);
      res.json({ tours });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith('Invalid city ID')
      ) {
        res.status(404).json({
          error: 'Not Found',
          message: error.message,
        });
      } else {
        console.error('Error fetching tours:', error);
        res.status(500).json({
          error: 'Internal Server Error',
          message: 'Failed to fetch tours',
        });
      }
    }
  }
);

/**
 * GET /api/tours/:cityId/:tourId
 * Get a specific tour by ID
 */
router.get(
  '/:cityId/:tourId',
  async (req: Request, res: Response<TourResponse | ErrorResponse>) => {
    try {
      const { cityId, tourId } = req.params;
      const tour = await toursService.getTourById(cityId, tourId);

      if (!tour) {
        res.status(404).json({
          error: 'Not Found',
          message: `Tour not found: ${tourId}`,
        });
        return;
      }

      res.json({ tour });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith('Invalid city ID')
      ) {
        res.status(404).json({
          error: 'Not Found',
          message: error.message,
        });
      } else {
        console.error('Error fetching tour:', error);
        res.status(500).json({
          error: 'Internal Server Error',
          message: 'Failed to fetch tour',
        });
      }
    }
  }
);

export default router;
