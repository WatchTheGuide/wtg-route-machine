/**
 * LibraryMediaCard Component
 * Card for a media item in the library browser section
 * Shows add button for unselected, "Already selected" badge for selected
 */

import { useTranslation } from 'react-i18next';
import { Plus, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getMediaUrl } from '@/lib/utils';
import type { MediaItem } from '@/types/media';

interface LibraryMediaCardProps {
  media: MediaItem;
  isSelected: boolean;
  isDisabled?: boolean; // When max limit reached
  onAdd: () => void;
}

export function LibraryMediaCard({
  media,
  isSelected,
  isDisabled = false,
  onAdd,
}: LibraryMediaCardProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`relative group ${
        isSelected || isDisabled ? 'opacity-60' : ''
      }`}
      data-testid={`library-media-card-${media.id}`}>
      <Card
        className={`overflow-hidden transition-all ${
          isSelected
            ? 'ring-2 ring-primary cursor-not-allowed'
            : isDisabled
            ? 'cursor-not-allowed'
            : 'hover:shadow-md cursor-pointer'
        }`}>
        {/* Selected badge */}
        {isSelected && (
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="default" className="text-xs">
              <Check className="h-3 w-3 mr-1" />
              {t('mediaPicker.alreadySelected')}
            </Badge>
          </div>
        )}

        {/* Image */}
        <div className="aspect-square bg-muted relative">
          <img
            src={getMediaUrl(media.thumbnailUrl)}
            alt={media.altText || media.title || media.originalName}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Add overlay - only show for unselected items */}
          {!isSelected && !isDisabled && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdd();
                    }}
                    data-testid={`library-media-add-${media.id}`}>
                    <Plus className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t('mediaPicker.addToTour')}</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="p-2">
          <p className="text-xs font-medium line-clamp-1">
            {media.title || media.originalName}
          </p>
        </div>
      </Card>
    </div>
  );
}
