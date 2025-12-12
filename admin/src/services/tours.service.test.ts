/**
 * Tests for Tours Service - Media Methods (US 8.16)
 *
 * Tests for getTourMedia and updateTourMedia API methods
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import toursService from './tours.service';
import apiClient from './api.client';

// Mock the API client
vi.mock('./api.client', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Tours Service - Media Methods (US 8.16)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================
  // getTourMedia
  // ============================================
  describe('getTourMedia', () => {
    it('should fetch tour media with empty arrays for new tour', async () => {
      // Arrange
      const mockResponse = {
        mediaIds: [],
        primaryMediaId: null,
      };
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await toursService.getTourMedia('tour-123');

      // Assert
      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/admin/tours/tour-123/media'
      );
      expect(result).toEqual({
        mediaIds: [],
        primaryMediaId: null,
      });
    });

    it('should fetch tour media with existing media IDs', async () => {
      // Arrange
      const mockResponse = {
        mediaIds: ['media-1', 'media-2', 'media-3'],
        primaryMediaId: 'media-1',
      };
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await toursService.getTourMedia('tour-456');

      // Assert
      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/admin/tours/tour-456/media'
      );
      expect(result.mediaIds).toHaveLength(3);
      expect(result.primaryMediaId).toBe('media-1');
    });

    it('should throw error when API call fails', async () => {
      // Arrange
      vi.mocked(apiClient.get).mockRejectedValueOnce(
        new Error('Network error')
      );

      // Act & Assert
      await expect(toursService.getTourMedia('tour-789')).rejects.toThrow(
        'Network error'
      );
    });
  });

  // ============================================
  // updateTourMedia
  // ============================================
  describe('updateTourMedia', () => {
    it('should update tour media IDs', async () => {
      // Arrange
      const updateData = {
        mediaIds: ['media-1', 'media-2'],
        primaryMediaId: 'media-1',
      };
      const mockResponse = {
        mediaIds: ['media-1', 'media-2'],
        primaryMediaId: 'media-1',
      };
      vi.mocked(apiClient.put).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await toursService.updateTourMedia('tour-123', updateData);

      // Assert
      expect(apiClient.put).toHaveBeenCalledWith(
        '/api/admin/tours/tour-123/media',
        updateData
      );
      expect(result.mediaIds).toEqual(['media-1', 'media-2']);
      expect(result.primaryMediaId).toBe('media-1');
    });

    it('should update tour with empty media array', async () => {
      // Arrange
      const updateData = {
        mediaIds: [],
      };
      const mockResponse = {
        mediaIds: [],
        primaryMediaId: null,
      };
      vi.mocked(apiClient.put).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await toursService.updateTourMedia('tour-123', updateData);

      // Assert
      expect(apiClient.put).toHaveBeenCalledWith(
        '/api/admin/tours/tour-123/media',
        updateData
      );
      expect(result.mediaIds).toEqual([]);
      expect(result.primaryMediaId).toBeNull();
    });

    it('should update primaryMediaId only', async () => {
      // Arrange
      const updateData = {
        mediaIds: ['media-1', 'media-2', 'media-3'],
        primaryMediaId: 'media-2', // changed from media-1 to media-2
      };
      const mockResponse = {
        mediaIds: ['media-1', 'media-2', 'media-3'],
        primaryMediaId: 'media-2',
      };
      vi.mocked(apiClient.put).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await toursService.updateTourMedia('tour-123', updateData);

      // Assert
      expect(result.primaryMediaId).toBe('media-2');
    });

    it('should throw error when API call fails', async () => {
      // Arrange
      vi.mocked(apiClient.put).mockRejectedValueOnce(
        new Error('Validation error')
      );

      // Act & Assert
      await expect(
        toursService.updateTourMedia('tour-123', { mediaIds: [] })
      ).rejects.toThrow('Validation error');
    });
  });
});
