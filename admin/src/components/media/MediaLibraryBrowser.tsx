/**
 * MediaLibraryBrowser Component
 * Bottom section of TourMediaPicker showing the media library with search and filters
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LibraryMediaCard } from './LibraryMediaCard';
import { MediaUpload } from './MediaUpload';
import { mediaService } from '@/services/media.service';
import type { MediaItem, UploadMediaInput } from '@/types/media';

type FilterType = 'all' | 'unused' | 'tour' | 'poi';

interface MediaLibraryBrowserProps {
  selectedIds: string[];
  maxItems?: number;
  onAddMedia: (media: MediaItem) => void;
  contextType?: 'tour' | 'poi' | 'standalone';
  contextId?: string;
}

export function MediaLibraryBrowser({
  selectedIds,
  maxItems = 10,
  onAddMedia,
  contextType,
  contextId,
}: MediaLibraryBrowserProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [uploadOpen, setUploadOpen] = useState(false);

  const isMaxReached = selectedIds.length >= maxItems;

  // Fetch media list
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['media-library', search, filter],
    queryFn: () =>
      mediaService.getMediaList({
        search: search || undefined,
        contextType:
          filter === 'all' || filter === 'unused' ? undefined : filter,
        limit: 50,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
  });

  const handleUpload = async (files: File[], input: UploadMediaInput) => {
    await mediaService.uploadMedia(files, {
      ...input,
      contextType,
      contextId,
    });
    await refetch();
  };

  // Filter out already selected items if filter is 'unused'
  const filteredMedia = data?.media.filter((media) => {
    if (filter === 'unused') {
      return !selectedIds.includes(media.id);
    }
    return true;
  });

  return (
    <Card data-testid="media-library-browser">
      <CardHeader className="pb-3 space-y-3">
        {/* Linia 1: Tytuł + Upload */}
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            {t('mediaPicker.libraryTitle')}
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setUploadOpen(true)}
            data-testid="media-library-upload">
            <Upload className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{t('media.upload')}</span>
          </Button>
        </div>

        {/* Linia 2: Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('mediaPicker.searchPlaceholder')}
              className="pl-9 h-9 w-full"
              data-testid="media-library-search"
            />
          </div>
          <Select
            value={filter}
            onValueChange={(v) => setFilter(v as FilterType)}>
            <SelectTrigger className="w-full sm:w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('mediaPicker.filterAll')}</SelectItem>
              <SelectItem value="unused">
                {t('mediaPicker.filterUnused')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isMaxReached && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('mediaPicker.maxLimitReached', { max: maxItems })}
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <LoadingSkeleton />
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : !filteredMedia || filteredMedia.length === 0 ? (
            <EmptyLibraryState onUpload={() => setUploadOpen(true)} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredMedia.map((media) => (
                <LibraryMediaCard
                  key={media.id}
                  media={media}
                  isSelected={selectedIds.includes(media.id)}
                  isDisabled={isMaxReached && !selectedIds.includes(media.id)}
                  onAdd={() => onAddMedia(media)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {/* Upload dialog */}
      <MediaUpload
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
        contextType={contextType}
        contextId={contextId}
      />
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-lg" />
      ))}
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <p className="text-muted-foreground font-medium">{t('common.error')}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="mt-4">
        <RefreshCw className="h-4 w-4 mr-2" />
        {t('common.retry')}
      </Button>
    </div>
  );
}

function EmptyLibraryState({ onUpload }: { onUpload: () => void }) {
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-col items-center justify-center py-8 text-center"
      data-testid="empty-state-library">
      <div className="rounded-full bg-muted p-4 mb-4">
        <ImageIcon className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground font-medium">
        {t('media.noResults')}
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onUpload}
        className="mt-4">
        <Upload className="h-4 w-4 mr-2" />
        {t('media.uploadFirst')}
      </Button>
    </div>
  );
}
