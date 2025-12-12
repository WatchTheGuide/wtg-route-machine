/**
 * MediaPicker Component
 * Reusable component for selecting media in forms (Tours/POI)
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Search, Upload, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { MediaUpload } from './MediaUpload';
import { mediaService } from '@/services/media.service';
import { getMediaUrl } from '@/lib/utils';
import type { MediaItem, UploadMediaInput } from '@/types/media';

interface MediaPickerProps {
  value?: string[]; // Selected media IDs
  onChange: (ids: string[]) => void;
  multiple?: boolean;
  contextType?: 'tour' | 'poi' | 'standalone';
  contextId?: string;
  className?: string;
}

export function MediaPicker({
  value = [],
  onChange,
  multiple = true,
  contextType,
  contextId,
  className,
}: MediaPickerProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(value);

  // Fetch media list
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['media', search, contextType],
    queryFn: () =>
      mediaService.getMediaList({
        search: search || undefined,
        contextType,
        limit: 50,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
  });

  // Sync with parent value
  useEffect(() => {
    setSelectedIds(value);
  }, [value]);

  const handleSelect = (mediaId: string) => {
    if (multiple) {
      const newIds = selectedIds.includes(mediaId)
        ? selectedIds.filter((id) => id !== mediaId)
        : [...selectedIds, mediaId];
      setSelectedIds(newIds);
      onChange(newIds);
    } else {
      const newIds = selectedIds[0] === mediaId ? [] : [mediaId];
      setSelectedIds(newIds);
      onChange(newIds);
    }
  };

  const handleUpload = async (files: File[], input: UploadMediaInput) => {
    const uploadedMedia = await mediaService.uploadMedia(files, {
      ...input,
      contextType,
      contextId,
    });
    await refetch();

    // Auto-select newly uploaded media
    if (uploadedMedia && uploadedMedia.length > 0) {
      const newMediaIds = uploadedMedia.map((m) => m.id);
      const updatedIds = multiple
        ? [...selectedIds, ...newMediaIds]
        : [newMediaIds[0]];
      setSelectedIds(updatedIds);
      onChange(updatedIds);
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
    onChange([]);
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('media.search')}
            className="pl-9"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          {t('media.upload')}
        </Button>
      </div>

      {/* Selected count */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">
            {t('media.selected', { count: selectedIds.length })}
          </Badge>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearSelection}>
            <X className="h-4 w-4 mr-1" />
            {t('common.clear')}
          </Button>
        </div>
      )}

      {/* Media grid */}
      <ScrollArea className="h-[400px] rounded-md border p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : data?.media.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <p className="text-muted-foreground">{t('media.noResults')}</p>
            <Button
              type="button"
              variant="link"
              onClick={() => setUploadOpen(true)}
              className="mt-2">
              {t('media.uploadFirst')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {data?.media.map((media) => (
              <MediaPickerCard
                key={media.id}
                media={media}
                selected={selectedIds.includes(media.id)}
                onSelect={() => handleSelect(media.id)}
                onRemove={() => {
                  const newIds = selectedIds.filter((id) => id !== media.id);
                  setSelectedIds(newIds);
                  onChange(newIds);
                }}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Upload dialog */}
      <MediaUpload
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
        contextType={contextType}
        contextId={contextId}
      />
    </div>
  );
}

// MediaPickerCard sub-component
interface MediaPickerCardProps {
  media: MediaItem;
  selected: boolean;
  onSelect: () => void;
  onRemove?: () => void;
}

function MediaPickerCard({
  media,
  selected,
  onSelect,
  onRemove,
}: MediaPickerCardProps) {
  const { t } = useTranslation();

  return (
    <div className="relative group">
      {/* Card - tylko do wizualizacji i selekcji */}
      <Card
        className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${
          selected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={onSelect}
        data-testid={`media-picker-card-${media.id}`}>
        <div className="aspect-square bg-muted relative">
          <img
            src={getMediaUrl(media.thumbnailUrl)}
            alt={media.altText || media.title || media.originalName}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Selected indicator overlay - no interactive elements inside */}
          {selected && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center pointer-events-none">
              <div className="bg-primary text-primary-foreground rounded-full p-2">
                <Check className="h-6 w-6" />
              </div>
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

      {/* Remove button - OUTSIDE Card structure, no event bubbling */}
      {selected && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 z-20 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:bg-destructive/90 transition-colors shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label={t('common.remove')}
          data-testid={`media-picker-remove-${media.id}`}>
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
