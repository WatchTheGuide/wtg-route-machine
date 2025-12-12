/**
 * Tests for SelectedMediaCard Component (US 8.16)
 *
 * Tests for user interactions: set primary, remove from selection
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SelectedMediaCard } from './SelectedMediaCard';
import type { MediaItem } from '@/types/media';

// Mock media item for testing
const mockMedia: MediaItem = {
  id: 'media-test-1',
  filename: 'test-image.jpg',
  originalName: 'Test Image.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 1024,
  width: 800,
  height: 600,
  url: '/uploads/test-image.jpg',
  thumbnailUrl: '/uploads/thumb-test-image.jpg',
  title: 'Test Image Title',
  altText: 'Alt text for test image',
  tags: ['test', 'sample'],
  contextType: 'tour',
  contextId: 'tour-1',
  uploadedBy: 'admin',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

interface RenderOptions {
  isPrimary?: boolean;
  onRemove?: () => void;
  onSetPrimary?: () => void;
  isDragging?: boolean;
}

function renderSelectedMediaCard(options: RenderOptions = {}) {
  const {
    isPrimary = false,
    onRemove = vi.fn(),
    onSetPrimary = vi.fn(),
    isDragging = false,
  } = options;

  return {
    ...render(
      <I18nextProvider i18n={i18n}>
        <TooltipProvider>
          <SelectedMediaCard
            media={mockMedia}
            isPrimary={isPrimary}
            onRemove={onRemove}
            onSetPrimary={onSetPrimary}
            isDragging={isDragging}
          />
        </TooltipProvider>
      </I18nextProvider>
    ),
    onRemove,
    onSetPrimary,
  };
}

describe('SelectedMediaCard Component (US 8.16)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    i18n.changeLanguage('pl');
  });

  describe('rendering', () => {
    it('should render media card with correct testid', () => {
      renderSelectedMediaCard();

      expect(
        screen.getByTestId(`selected-media-card-${mockMedia.id}`)
      ).toBeInTheDocument();
    });

    it('should display media image', () => {
      renderSelectedMediaCard();

      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', mockMedia.altText);
    });

    it('should display media title', () => {
      renderSelectedMediaCard();

      expect(screen.getByText(mockMedia.title!)).toBeInTheDocument();
    });

    it('should show primary badge when isPrimary is true', () => {
      renderSelectedMediaCard({ isPrimary: true });

      expect(screen.getByText(/główne/i)).toBeInTheDocument();
    });

    it('should not show primary badge when isPrimary is false', () => {
      renderSelectedMediaCard({ isPrimary: false });

      expect(screen.queryByText(/główne/i)).not.toBeInTheDocument();
    });

    it('should apply opacity when isDragging is true', () => {
      renderSelectedMediaCard({ isDragging: true });

      const card = screen.getByTestId(`selected-media-card-${mockMedia.id}`);
      expect(card.className).toContain('opacity-50');
    });
  });

  describe('user interactions', () => {
    it('should call onRemove when remove button is clicked', async () => {
      const user = userEvent.setup();
      const { onRemove } = renderSelectedMediaCard();

      const removeButton = screen.getByTestId(
        `selected-media-remove-${mockMedia.id}`
      );
      await user.click(removeButton);

      expect(onRemove).toHaveBeenCalledOnce();
    });

    it('should call onSetPrimary when star button is clicked', async () => {
      const user = userEvent.setup();
      const { onSetPrimary } = renderSelectedMediaCard({ isPrimary: false });

      const primaryButton = screen.getByTestId(
        `selected-media-primary-${mockMedia.id}`
      );
      await user.click(primaryButton);

      expect(onSetPrimary).toHaveBeenCalledOnce();
    });

    it('should call onSetPrimary even when already primary (toggle behavior)', async () => {
      const user = userEvent.setup();
      const { onSetPrimary } = renderSelectedMediaCard({ isPrimary: true });

      const primaryButton = screen.getByTestId(
        `selected-media-primary-${mockMedia.id}`
      );
      await user.click(primaryButton);

      expect(onSetPrimary).toHaveBeenCalledOnce();
    });
  });

  describe('button accessibility', () => {
    it('should have remove button accessible', () => {
      renderSelectedMediaCard();

      const removeButton = screen.getByTestId(
        `selected-media-remove-${mockMedia.id}`
      );
      expect(removeButton).toHaveAttribute('type', 'button');
    });

    it('should have primary button accessible', () => {
      renderSelectedMediaCard();

      const primaryButton = screen.getByTestId(
        `selected-media-primary-${mockMedia.id}`
      );
      expect(primaryButton).toHaveAttribute('type', 'button');
    });

    it('should have drag handle with correct testid', () => {
      renderSelectedMediaCard();

      expect(
        screen.getByTestId(`selected-media-drag-handle-${mockMedia.id}`)
      ).toBeInTheDocument();
    });
  });
});
