/**
 * MediaCard Component
 * Card displaying media item in gallery grid
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MoreVertical, Pencil, Trash2, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import type { MediaItem } from '@/types/media';
import { formatFileSize, getMediaUrl } from '@/lib/utils';

interface MediaCardProps {
  media: MediaItem;
  onEdit: (media: MediaItem) => void;
  onDelete: (media: MediaItem) => void;
  onClick?: (media: MediaItem) => void;
  selected?: boolean;
}

export function MediaCard({
  media,
  onEdit,
  onDelete,
  onClick,
  selected,
}: MediaCardProps) {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick(media);
    }
  };

  return (
    <Card
      data-testid="media-card"
      className={`group relative overflow-hidden transition-all hover:shadow-lg cursor-pointer ${
        selected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={handleCardClick}>
      {/* Image */}
      <div className="aspect-square bg-muted relative overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center text-muted-foreground">
              <svg
                className="mx-auto h-12 w-12 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs">
                {t('media.loadError', 'Image not available')}
              </span>
            </div>
          </div>
        ) : (
          <img
            data-testid="media-thumbnail"
            src={getMediaUrl(media.thumbnailUrl)}
            alt={media.altText || media.title || media.originalName}
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-105`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        )}

        {/* Actions overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 shadow-md">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                data-testid="edit-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(media);
                }}>
                <Pencil className="mr-2 h-4 w-4" />
                {t('common.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(media);
                }}
                className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <h3
          data-testid="media-title"
          className="font-medium text-sm line-clamp-1"
          title={media.title || media.originalName}>
          {media.title || media.originalName}
        </h3>

        {/* Tags */}
        {media.tags.length > 0 && (
          <div data-testid="media-tags" className="flex flex-wrap gap-1">
            {media.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
            {media.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{media.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {media.width} × {media.height}
          </span>
          <span>{formatFileSize(media.sizeBytes)}</span>
        </div>
      </div>
    </Card>
  );
}
