/**
 * Media Manager Types
 * Types for the media library and image management
 */

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width: number;
  height: number;
  url: string;
  thumbnailUrl: string;
  title: string | null;
  altText: string | null;
  tags: string[];
  contextType: 'tour' | 'poi' | 'standalone' | null;
  contextId: string | null;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFilters {
  tags?: string[];
  contextType?: 'tour' | 'poi' | 'standalone';
  contextId?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'title' | 'sizeBytes';
  sortOrder?: 'asc' | 'desc';
}

export interface UploadMediaInput {
  title?: string;
  altText?: string;
  tags?: string[];
  contextType?: 'tour' | 'poi' | 'standalone';
  contextId?: string;
}

export interface MediaListResponse {
  media: MediaItem[];
  total: number;
  hasMore: boolean;
}
