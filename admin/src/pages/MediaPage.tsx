/**
 * MediaPage Component
 * Main media gallery page with upload, search, and management
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, SlidersHorizontal, Grid3x3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { MediaCard } from '@/components/media/MediaCard';
import { MediaUpload } from '@/components/media/MediaUpload';
import { MediaDetailsModal } from '@/components/media/MediaDetailsModal';
import { mediaService } from '@/services/media.service';
import type { MediaItem, MediaFilters, UploadMediaInput } from '@/types/media';

export function MediaPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // State
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'title' | 'sizeBytes'>(
    'createdAt'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [contextFilter, setContextFilter] = useState<
    'all' | 'tour' | 'poi' | 'standalone'
  >('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch media
  const filters: MediaFilters = {
    search: search || undefined,
    contextType: contextFilter === 'all' ? undefined : contextFilter,
    sortBy,
    sortOrder,
    limit: 50,
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['media', filters],
    queryFn: () => mediaService.getMediaList(filters),
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: ({
      files,
      input,
    }: {
      files: File[];
      input: UploadMediaInput;
    }) => mediaService.uploadMedia(files, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      refetch();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: { title?: string; altText?: string; tags?: string[] };
    }) => mediaService.updateMedia(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      refetch();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => mediaService.deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      refetch();
    },
  });

  const handleUpload = async (files: File[], input: UploadMediaInput) => {
    await uploadMutation.mutateAsync({ files, input });
  };

  const handleUpdate = async (
    id: string,
    input: { title?: string; altText?: string; tags?: string[] }
  ) => {
    await updateMutation.mutateAsync({ id, input });
  };

  const handleDelete = async (media: MediaItem) => {
    if (!confirm(t('media.deleteConfirm'))) return;

    try {
      await deleteMutation.mutateAsync(media.id);
      toast.success(t('media.deleteSuccess'));
    } catch {
      toast.error(t('media.deleteError'));
    }
  };

  const handleEdit = (media: MediaItem) => {
    setSelectedMedia(media);
    setDetailsOpen(true);
  };

  const handleCardClick = (media: MediaItem) => {
    setSelectedMedia(media);
    setDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('media.title')}</h1>
          <p className="text-muted-foreground">{t('media.subtitle')}</p>
        </div>
        <Button data-testid="upload-button" onClick={() => setUploadOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('media.upload')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-testid="media-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('media.search')}
            className="pl-9"
          />
        </div>

        {/* Context filter */}
        <Select
          value={contextFilter}
          onValueChange={(v) =>
            setContextFilter(v as 'all' | 'tour' | 'poi' | 'standalone')
          }>
          <SelectTrigger data-testid="context-filter" className="w-[180px]">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('media.allMedia')}</SelectItem>
            <SelectItem value="tour">{t('media.tourImages')}</SelectItem>
            <SelectItem value="poi">{t('media.poiImages')}</SelectItem>
            <SelectItem value="standalone">{t('media.standalone')}</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={sortBy}
          onValueChange={(v) =>
            setSortBy(v as 'createdAt' | 'title' | 'sizeBytes')
          }>
          <SelectTrigger data-testid="sort-by" className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">{t('media.sortByDate')}</SelectItem>
            <SelectItem value="title">{t('media.sortByTitle')}</SelectItem>
            <SelectItem value="sizeBytes">{t('media.sortBySize')}</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort order */}
        <Button
          data-testid="sort-order"
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
          {sortOrder === 'asc' ? '↑' : '↓'}
        </Button>
      </div>

      {/* Stats */}
      {data && (
        <div className="flex items-center gap-4 text-sm">
          <Badge data-testid="media-count" variant="secondary">
            {t('media.totalMedia', { count: data.total })}
          </Badge>
          {search && (
            <span className="text-muted-foreground">
              {t('media.showing', { count: data.media.length })}
            </span>
          )}
        </div>
      )}

      {/* Media grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : data?.media.length === 0 ? (
        <div
          data-testid="no-results"
          className="flex flex-col items-center justify-center py-16 text-center">
          <Grid3x3 className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('media.noResults')}</h3>
          <p className="text-muted-foreground mb-4">
            {t('media.noResultsDesc')}
          </p>
          <Button
            data-testid="upload-first-media-button"
            onClick={() => setUploadOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('media.uploadFirst')}
          </Button>
        </div>
      ) : (
        <div
          data-testid="media-grid"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data?.media.map((media) => (
            <MediaCard
              key={media.id}
              media={media}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}

      {/* Upload dialog */}
      <MediaUpload
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
      />

      {/* Details modal */}
      <MediaDetailsModal
        media={selectedMedia}
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedMedia(null);
        }}
        onUpdate={handleUpdate}
        onDelete={async (id) => {
          await deleteMutation.mutateAsync(id);
          setDetailsOpen(false);
          setSelectedMedia(null);
        }}
      />
    </div>
  );
}
