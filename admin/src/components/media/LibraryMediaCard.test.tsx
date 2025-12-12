/**
 * Tests for LibraryMediaCard Component (US 8.16)
 *
 * Tests for user interactions: add to selection, disabled states
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LibraryMediaCard } from './LibraryMediaCard';
import type { MediaItem } from '@/types/media';

// Mock media item for testing
const mockMedia: MediaItem = {
  id: 'media-lib-1',
  filename: 'library-image.jpg',
  originalName: 'Library Image.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 2048,
  width: 1024,
  height: 768,
  url: '/uploads/library-image.jpg',
  thumbnailUrl: '/uploads/thumb-library-image.jpg',
  title: 'Library Image Title',
  altText: 'Alt text for library image',
  tags: ['library', 'sample'],
  contextType: 'standalone',
  contextId: null,
  uploadedBy: 'admin',
  createdAt: '2024-01-02',
  updatedAt: '2024-01-02',
};

interface RenderOptions {
  isSelected?: boolean;
  isDisabled?: boolean;
  onAdd?: () => void;
}

function renderLibraryMediaCard(options: RenderOptions = {}) {
  const { isSelected = false, isDisabled = false, onAdd = vi.fn() } = options;

  return {
    ...render(
      <I18nextProvider i18n={i18n}>
        <TooltipProvider>
          <LibraryMediaCard
            media={mockMedia}
            isSelected={isSelected}
            isDisabled={isDisabled}
            onAdd={onAdd}
          />
        </TooltipProvider>
      </I18nextProvider>
    ),
    onAdd,
  };
}

describe('LibraryMediaCard Component (US 8.16)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    i18n.changeLanguage('pl');
  });

  describe('rendering', () => {
    it('should render media card with correct testid', () => {
      renderLibraryMediaCard();

      expect(
        screen.getByTestId(`library-media-card-${mockMedia.id}`)
      ).toBeInTheDocument();
    });

    it('should display media image', () => {
      renderLibraryMediaCard();

      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', mockMedia.altText);
    });

    it('should display media title', () => {
      renderLibraryMediaCard();

      expect(screen.getByText(mockMedia.title!)).toBeInTheDocument();
    });
  });

  describe('selected state', () => {
    it('should show "already selected" badge when isSelected is true', () => {
      renderLibraryMediaCard({ isSelected: true });

      expect(screen.getByText(/wybrane/i)).toBeInTheDocument();
    });

    it('should not show add button when already selected', () => {
      renderLibraryMediaCard({ isSelected: true });

      expect(
        screen.queryByTestId(`library-media-add-${mockMedia.id}`)
      ).not.toBeInTheDocument();
    });

    it('should apply opacity when isSelected is true', () => {
      renderLibraryMediaCard({ isSelected: true });

      const card = screen.getByTestId(`library-media-card-${mockMedia.id}`);
      expect(card.className).toContain('opacity-60');
    });
  });

  describe('disabled state (max limit reached)', () => {
    it('should not show add button when isDisabled is true', () => {
      renderLibraryMediaCard({ isDisabled: true });

      expect(
        screen.queryByTestId(`library-media-add-${mockMedia.id}`)
      ).not.toBeInTheDocument();
    });

    it('should apply opacity when isDisabled is true', () => {
      renderLibraryMediaCard({ isDisabled: true });

      const card = screen.getByTestId(`library-media-card-${mockMedia.id}`);
      expect(card.className).toContain('opacity-60');
    });
  });

  describe('user interactions', () => {
    it('should call onAdd when add button is clicked', async () => {
      const user = userEvent.setup();
      const { onAdd } = renderLibraryMediaCard({ isSelected: false });

      const addButton = screen.getByTestId(`library-media-add-${mockMedia.id}`);
      await user.click(addButton);

      expect(onAdd).toHaveBeenCalledOnce();
    });

    it('should not call onAdd when already selected (no button rendered)', async () => {
      const { onAdd } = renderLibraryMediaCard({ isSelected: true });

      // Button should not be rendered
      expect(
        screen.queryByTestId(`library-media-add-${mockMedia.id}`)
      ).not.toBeInTheDocument();
      expect(onAdd).not.toHaveBeenCalled();
    });

    it('should not call onAdd when disabled (no button rendered)', async () => {
      const { onAdd } = renderLibraryMediaCard({ isDisabled: true });

      // Button should not be rendered
      expect(
        screen.queryByTestId(`library-media-add-${mockMedia.id}`)
      ).not.toBeInTheDocument();
      expect(onAdd).not.toHaveBeenCalled();
    });
  });

  describe('button accessibility', () => {
    it('should have add button with correct type', () => {
      renderLibraryMediaCard();

      const addButton = screen.getByTestId(`library-media-add-${mockMedia.id}`);
      expect(addButton).toHaveAttribute('type', 'button');
    });
  });

  describe('edge cases', () => {
    it('should show add button when neither selected nor disabled', () => {
      renderLibraryMediaCard({ isSelected: false, isDisabled: false });

      expect(
        screen.getByTestId(`library-media-add-${mockMedia.id}`)
      ).toBeInTheDocument();
    });

    it('should handle media without title gracefully', () => {
      const mediaWithoutTitle = { ...mockMedia, title: null };

      render(
        <I18nextProvider i18n={i18n}>
          <TooltipProvider>
            <LibraryMediaCard
              media={mediaWithoutTitle}
              isSelected={false}
              onAdd={vi.fn()}
            />
          </TooltipProvider>
        </I18nextProvider>
      );

      // Should fall back to originalName
      expect(screen.getByText(mockMedia.originalName)).toBeInTheDocument();
    });
  });
});
