/**
 * Media Service
 * API client for media/image management operations
 */

import { apiClient, getAccessToken } from './api.client';
import type {
  MediaItem,
  MediaFilters,
  UploadMediaInput,
  MediaListResponse,
} from '@/types/media';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class MediaService {
  private baseUrl = '/api/admin/media';

  /**
   * Upload media files
   */
  async uploadMedia(
    files: File[],
    input: UploadMediaInput = {}
  ): Promise<MediaItem[]> {
    const formData = new FormData();

    files.forEach((file) => formData.append('files', file));
    if (input.title) formData.append('title', input.title);
    if (input.altText) formData.append('altText', input.altText);
    if (input.tags) formData.append('tags', input.tags.join(','));
    if (input.contextType) formData.append('contextType', input.contextType);
    if (input.contextId) formData.append('contextId', input.contextId);

    const token = getAccessToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${this.baseUrl}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.media;
  }

  /**
   * Get media list with filters
   */
  async getMediaList(filters: MediaFilters = {}): Promise<MediaListResponse> {
    const params = new URLSearchParams();
    if (filters.tags?.length) params.set('tags', filters.tags.join(','));
    if (filters.contextType) params.set('contextType', filters.contextType);
    if (filters.search) params.set('search', filters.search);
    if (filters.limit) params.set('limit', filters.limit.toString());
    if (filters.offset) params.set('offset', filters.offset.toString());
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    return apiClient.get<MediaListResponse>(
      `${this.baseUrl}?${params.toString()}`
    );
  }

  /**
   * Get single media by ID
   */
  async getMediaById(id: string): Promise<MediaItem> {
    const response = await apiClient.get<{ media: MediaItem }>(
      `${this.baseUrl}/${id}`
    );
    return response.media;
  }

  /**
   * Update media metadata
   */
  async updateMedia(
    id: string,
    input: { title?: string; altText?: string; tags?: string[] }
  ): Promise<MediaItem> {
    const response = await apiClient.put<{ media: MediaItem }>(
      `${this.baseUrl}/${id}`,
      input
    );
    return response.media;
  }

  /**
   * Delete media
   */
  async deleteMedia(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}

export const mediaService = new MediaService();
