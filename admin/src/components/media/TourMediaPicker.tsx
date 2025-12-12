/**
 * TourMediaPicker Component
 * Complete media picker for Tour Editor with two sections:
 * 1. Selected Media Section (top) - with drag & drop reordering, primary selection
 * 2. Media Library Browser (bottom) - for browsing and selecting from library
 *
 * Fixes BUG-007: Remove button event bubbling
 * Implements US 8.16: Tour Media Integration
 */

import { useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { SelectedMediaSection } from './SelectedMediaSection';
import { MediaLibraryBrowser } from './MediaLibraryBrowser';
import { mediaService } from '@/services/media.service';
import type { MediaItem } from '@/types/media';

interface TourMediaPickerProps {
  // Controlled state
  selectedIds: string[];
  primaryId?: string;
  onSelectionChange: (ids: string[]) => void;
  onPrimaryChange?: (id: string | undefined) => void;

  // Config
  maxItems?: number;
  contextType?: 'tour' | 'poi';
  contextId?: string;

  // Optional
  className?: string;
}

export function TourMediaPicker({
  selectedIds,
  primaryId,
  onSelectionChange,
  onPrimaryChange,
  maxItems = 10,
  contextType = 'tour',
  contextId,
  className,
}: TourMediaPickerProps) {
  const { t } = useTranslation();

  // Fetch selected media details
  const { data: selectedMediaData } = useQuery({
    queryKey: ['selected-media', selectedIds],
    queryFn: async () => {
      if (selectedIds.length === 0) return [];

      // Fetch all media and filter by selected IDs
      const response = await mediaService.getMediaList({
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      // Create a map for O(1) lookup
      const mediaMap = new Map(response.media.map((m) => [m.id, m]));

      // Return media in the order of selectedIds
      return selectedIds
        .map((id) => mediaMap.get(id))
        .filter((m): m is MediaItem => m !== undefined);
    },
    enabled: selectedIds.length > 0,
  });

  // Selected media items in order
  const selectedItems = useMemo(() => {
    if (!selectedMediaData) return [];
    return selectedMediaData;
  }, [selectedMediaData]);

  // Auto-set first image as primary if none set
  useEffect(() => {
    if (selectedIds.length > 0 && !primaryId && onPrimaryChange) {
      onPrimaryChange(selectedIds[0]);
    }
    // Clear primary if removed from selection
    if (primaryId && !selectedIds.includes(primaryId) && onPrimaryChange) {
      onPrimaryChange(selectedIds[0] || undefined);
    }
  }, [selectedIds, primaryId, onPrimaryChange]);

  // Handlers
  const handleAddMedia = useCallback(
    (media: MediaItem) => {
      if (selectedIds.length >= maxItems) {
        toast.error(t('mediaPicker.maxLimitReached', { max: maxItems }));
        return;
      }

      if (selectedIds.includes(media.id)) {
        return; // Already selected
      }

      const newIds = [...selectedIds, media.id];
      onSelectionChange(newIds);
      toast.success(
        t('mediaPicker.toasts.added', {
          name: media.title || media.originalName,
        })
      );
    },
    [selectedIds, maxItems, onSelectionChange, t]
  );

  const handleRemoveMedia = useCallback(
    (id: string) => {
      const media = selectedItems.find((m) => m.id === id);
      const newIds = selectedIds.filter((selectedId) => selectedId !== id);
      onSelectionChange(newIds);

      if (media) {
        toast.success(
          t('mediaPicker.toasts.removed', {
            name: media.title || media.originalName,
          })
        );
      }
    },
    [selectedIds, selectedItems, onSelectionChange, t]
  );

  const handleSetPrimary = useCallback(
    (id: string) => {
      if (onPrimaryChange) {
        onPrimaryChange(id);
        const media = selectedItems.find((m) => m.id === id);
        if (media) {
          toast.success(
            t('mediaPicker.toasts.setPrimary', {
              name: media.title || media.originalName,
            })
          );
        }
      }
    },
    [selectedItems, onPrimaryChange, t]
  );

  const handleOrderChange = useCallback(
    (newOrder: string[]) => {
      onSelectionChange(newOrder);
      toast.success(t('mediaPicker.toasts.reordered'));
    },
    [onSelectionChange, t]
  );

  const handleClearAll = useCallback(() => {
    onSelectionChange([]);
    if (onPrimaryChange) {
      onPrimaryChange(undefined);
    }
    toast.success(t('mediaPicker.toasts.clearedAll'));
  }, [onSelectionChange, onPrimaryChange, t]);

  return (
    <TooltipProvider>
      <div
        className={`space-y-4 ${className || ''}`}
        data-testid="tour-media-picker">
        {/* Selected Media Section (top) */}
        <SelectedMediaSection
          items={selectedItems}
          primaryId={primaryId}
          maxItems={maxItems}
          onOrderChange={handleOrderChange}
          onRemove={handleRemoveMedia}
          onSetPrimary={handleSetPrimary}
          onClearAll={handleClearAll}
        />

        <Separator />

        {/* Media Library Browser (bottom) */}
        <MediaLibraryBrowser
          selectedIds={selectedIds}
          maxItems={maxItems}
          onAddMedia={handleAddMedia}
          contextType={contextType}
          contextId={contextId}
        />
      </div>
    </TooltipProvider>
  );
}
