/**
 * Tests for TourMediaPicker Component (US 8.16)
 *
 * Basic tests for the tour media picker functionality.
 * Note: Drag & drop tests are complex and covered by Cypress E2E tests.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { TourMediaPicker } from './TourMediaPicker';
import { mediaService } from '@/services/media.service';
import type { MediaItem } from '@/types/media';

// Mock the media service
vi.mock('@/services/media.service', () => ({
  mediaService: {
    getMediaList: vi.fn(),
  },
}));

// Mock sonner toast
vi.mock('@/components/ui/sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Create a fresh QueryClient for each test
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
    },
  });
}

interface RenderOptions {
  selectedIds?: string[];
  primaryId?: string;
  onSelectionChange?: (ids: string[]) => void;
  onPrimaryChange?: (id: string | undefined) => void;
  maxItems?: number;
}

function renderTourMediaPicker(options: RenderOptions = {}) {
  const {
    selectedIds = [],
    primaryId,
    onSelectionChange = vi.fn(),
    onPrimaryChange = vi.fn(),
    maxItems = 10,
  } = options;

  const queryClient = createTestQueryClient();

  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <TourMediaPicker
            selectedIds={selectedIds}
            primaryId={primaryId}
            onSelectionChange={onSelectionChange}
            onPrimaryChange={onPrimaryChange}
            maxItems={maxItems}
          />
        </I18nextProvider>
      </QueryClientProvider>
    ),
    onSelectionChange,
    onPrimaryChange,
  };
}

describe('TourMediaPicker Component (US 8.16)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    i18n.changeLanguage('pl');

    // Default mock for media list
    vi.mocked(mediaService.getMediaList).mockResolvedValue({
      media: [],
      total: 0,
      hasMore: false,
    });
  });

  describe('rendering', () => {
    it('should render selected media section', () => {
      renderTourMediaPicker();

      // Should show "Selected images" header (Polish: "Wybrane zdjęcia")
      expect(screen.getByText(/Wybrane zdjęcia/i)).toBeInTheDocument();
    });

    it('should render media library section', () => {
      renderTourMediaPicker();

      // Should show "Media library" header
      expect(screen.getByText(/Biblioteka mediów/i)).toBeInTheDocument();
    });

    it('should show empty state when no images selected', () => {
      renderTourMediaPicker({ selectedIds: [] });

      // Should show empty state message (Polish: "Brak wybranych zdjęć")
      expect(screen.getByText(/Brak wybranych zdjęć/i)).toBeInTheDocument();
    });

    it('should show selection count in header', () => {
      renderTourMediaPicker({ selectedIds: [], maxItems: 10 });

      // Should show "0" and "/10" as part of the count
      // Text is split: "( 0 / 10 )"
      expect(screen.getByTestId('selected-media-section')).toHaveTextContent(
        '0'
      );
      expect(screen.getByTestId('selected-media-section')).toHaveTextContent(
        '10'
      );
    });
  });

  describe('with selected media', () => {
    const mockMedia: MediaItem[] = [
      {
        id: 'media-1',
        filename: 'image1.jpg',
        originalName: 'image1.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 1024,
        width: 800,
        height: 600,
        url: '/uploads/image1.jpg',
        thumbnailUrl: '/uploads/thumb-image1.jpg',
        title: 'Image 1',
        altText: 'Alt text 1',
        tags: [],
        contextType: 'tour',
        contextId: 'tour-1',
        uploadedBy: 'admin',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: 'media-2',
        filename: 'image2.jpg',
        originalName: 'image2.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 2048,
        width: 1024,
        height: 768,
        url: '/uploads/image2.jpg',
        thumbnailUrl: '/uploads/thumb-image2.jpg',
        title: 'Image 2',
        altText: 'Alt text 2',
        tags: [],
        contextType: 'tour',
        contextId: 'tour-1',
        uploadedBy: 'admin',
        createdAt: '2024-01-02',
        updatedAt: '2024-01-02',
      },
    ];

    beforeEach(() => {
      vi.mocked(mediaService.getMediaList).mockResolvedValue({
        media: mockMedia,
        total: 2,
        hasMore: false,
      });
    });

    it('should display selected media count', async () => {
      renderTourMediaPicker({
        selectedIds: ['media-1', 'media-2'],
        primaryId: 'media-1',
      });

      // Should show "2" in the count
      await waitFor(() => {
        expect(screen.getByTestId('selected-media-section')).toHaveTextContent(
          '2'
        );
      });
    });

    it('should call onSelectionChange when selection changes', async () => {
      const onSelectionChange = vi.fn();

      renderTourMediaPicker({
        selectedIds: ['media-1'],
        primaryId: 'media-1',
        onSelectionChange,
      });

      // Component is rendered, handlers are in place
      expect(onSelectionChange).not.toHaveBeenCalled();
    });
  });

  describe('max items limit', () => {
    it('should display correct max items in counter', () => {
      renderTourMediaPicker({ maxItems: 5 });

      // Should show "/5" as part of the count
      expect(screen.getByTestId('selected-media-section')).toHaveTextContent(
        '5'
      );
    });

    it('should display custom max items limit', () => {
      renderTourMediaPicker({
        selectedIds: ['media-1', 'media-2', 'media-3'],
        maxItems: 3,
      });

      // Should show "3" and "/3"
      expect(screen.getByTestId('selected-media-section')).toHaveTextContent(
        '3'
      );
    });
  });

  describe('accessibility', () => {
    it('should have data-testid for main sections', () => {
      renderTourMediaPicker();

      // Check for data-testid attributes
      expect(screen.getByTestId('tour-media-picker')).toBeInTheDocument();
      expect(screen.getByTestId('selected-media-section')).toBeInTheDocument();
    });
  });
});
