/**
 * SelectedMediaSection Component
 * Top section of TourMediaPicker showing selected images with drag & drop reordering
 */

import { useTranslation } from 'react-i18next';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SortableSelectedMediaCard } from './SelectedMediaCard';
import type { MediaItem } from '@/types/media';

interface SelectedMediaSectionProps {
  items: MediaItem[];
  primaryId?: string;
  maxItems?: number;
  onOrderChange: (newOrder: string[]) => void;
  onRemove: (id: string) => void;
  onSetPrimary: (id: string) => void;
  onClearAll: () => void;
}

export function SelectedMediaSection({
  items,
  primaryId,
  maxItems = 10,
  onOrderChange,
  onRemove,
  onSetPrimary,
  onClearAll,
}: SelectedMediaSectionProps) {
  const { t } = useTranslation();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(
        items.map((item) => item.id),
        oldIndex,
        newIndex
      );
      onOrderChange(newOrder);
    }
  };

  return (
    <Card data-testid="selected-media-section">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            {t('mediaPicker.selectedTitle')} ({items.length}/{maxItems})
          </CardTitle>
          {items.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-destructive hover:text-destructive"
              data-testid="clear-all-button">
              <X className="h-4 w-4 mr-1" />
              {t('mediaPicker.clearAll')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}>
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {items.map((media) => (
                    <SortableSelectedMediaCard
                      key={media.id}
                      id={media.id}
                      media={media}
                      isPrimary={media.id === primaryId}
                      onRemove={() => onRemove(media.id)}
                      onSetPrimary={() => onSetPrimary(media.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <p className="text-xs text-muted-foreground mt-3">
              {t('mediaPicker.dndHint')}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-col items-center justify-center py-8 text-center"
      data-testid="empty-state-selected">
      <div className="rounded-full bg-muted p-4 mb-4">
        <ImageIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground font-medium">
        {t('mediaPicker.emptySelected')}
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        {t('mediaPicker.emptySelectedHint')}
      </p>
    </div>
  );
}
