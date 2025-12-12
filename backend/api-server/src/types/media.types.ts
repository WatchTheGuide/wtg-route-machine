import { z } from 'zod';

// ============================================
// VALIDATION SCHEMAS
// ============================================

export const uploadMediaSchema = z.object({
  title: z.string().optional(),
  altText: z.string().optional(),
  tags: z.array(z.string()).optional(),
  contextType: z.enum(['tour', 'poi', 'standalone']).optional(),
  contextId: z.string().optional(),
});

export const updateMediaSchema = z.object({
  title: z.string().optional(),
  altText: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const mediaFiltersSchema = z.object({
  tags: z.array(z.string()).optional(),
  contextType: z.enum(['tour', 'poi', 'standalone']).optional(),
  contextId: z.string().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
  sortBy: z.enum(['createdAt', 'title', 'sizeBytes']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================
// TYPESCRIPT TYPES
// ============================================

export type UploadMediaInput = z.infer<typeof uploadMediaSchema>;
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>;
export type MediaFilters = z.infer<typeof mediaFiltersSchema>;

export interface MediaObject {
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
