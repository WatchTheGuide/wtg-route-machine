/**
 * SelectedMediaCard Component
 * Card for a selected media item in TourMediaPicker
 * Features: drag handle, set primary, remove - buttons OUTSIDE Card structure
 */

import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Star, Trash2, GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getMediaUrl } from '@/lib/utils';
import type { MediaItem } from '@/types/media';

interface SelectedMediaCardProps {
  media: MediaItem;
  isPrimary: boolean;
  onRemove: () => void;
  onSetPrimary: () => void;
  isDragging?: boolean;
}

export const SelectedMediaCard = forwardRef<
  HTMLDivElement,
  SelectedMediaCardProps
>(function SelectedMediaCard(
  { media, isPrimary, onRemove, onSetPrimary, isDragging = false },
  ref
) {
  const { t } = useTranslation();

  return (
    <div
      ref={ref}
      className={`relative group ${isDragging ? 'opacity-50' : ''}`}
      data-testid={`selected-media-card-${media.id}`}>
      {/* Card - visual container only */}
      <Card className="overflow-hidden transition-all hover:shadow-md">
        {/* Drag handle */}
        <div
          className="absolute top-2 left-2 z-10 p-1 rounded bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          data-testid={`selected-media-drag-handle-${media.id}`}>
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        {/* Primary badge */}
        {isPrimary && (
          <div className="absolute top-2 right-2 z-10 px-2 py-1 rounded bg-yellow-500 text-yellow-950 text-xs font-medium flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            {t('mediaPicker.isPrimary')}
          </div>
        )}

        {/* Image */}
        <div className="aspect-square bg-muted">
          <img
            src={getMediaUrl(media.thumbnailUrl)}
            alt={media.altText || media.title || media.originalName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Title */}
        <div className="p-2">
          <p className="text-xs font-medium line-clamp-1">
            {media.title || media.originalName}
          </p>
        </div>
      </Card>

      {/* Action buttons - OUTSIDE Card structure to avoid event bubbling */}
      <div className="absolute bottom-12 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={isPrimary ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8 bg-background/90 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                onSetPrimary();
              }}
              data-testid={`selected-media-primary-${media.id}`}>
              <Star className={`h-4 w-4 ${isPrimary ? 'fill-current' : ''}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isPrimary
              ? t('mediaPicker.isPrimary')
              : t('mediaPicker.setAsPrimary')}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              data-testid={`selected-media-remove-${media.id}`}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('mediaPicker.removeFromTour')}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
});

// Sortable version with dnd-kit
interface SortableSelectedMediaCardProps extends SelectedMediaCardProps {
  id: string;
}

export function SortableSelectedMediaCard({
  id,
  ...props
}: SortableSelectedMediaCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SelectedMediaCard {...props} isDragging={isDragging} />
    </div>
  );
}
