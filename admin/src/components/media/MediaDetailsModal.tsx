/**
 * MediaDetailsModal Component
 * Modal for viewing and editing media metadata
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { MediaItem } from '@/types/media';
import { formatFileSize, getMediaUrl } from '@/lib/utils';

interface MediaDetailsModalProps {
  media: MediaItem | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (
    id: string,
    input: { title?: string; altText?: string; tags?: string[] }
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function MediaDetailsModal({
  media,
  open,
  onClose,
  onUpdate,
  onDelete,
}: MediaDetailsModalProps) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (media) {
      setTitle(media.title || '');
      setAltText(media.altText || '');
      setTags(media.tags.join(', '));
    }
  }, [media]);

  if (!media) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(media.id, {
        title: title || undefined,
        altText: altText || undefined,
        tags: tags
          ? tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      });
      toast.success(t('media.updateSuccess'));
      setEditing(false);
    } catch (error) {
      toast.error(t('media.updateError'));
      console.error('Update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t('media.deleteConfirm'))) return;

    try {
      await onDelete(media.id);
      toast.success(t('media.deleteSuccess'));
      onClose();
    } catch (error) {
      toast.error(t('media.deleteError'));
      console.error('Delete error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        data-testid="media-details-modal"
        className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{t('media.imageDetails')}</span>
            <div className="flex gap-2">
              {!editing && (
                <Button
                  data-testid="edit-button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  {t('common.edit')}
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image preview */}
          <div className="space-y-4">
            <div className="relative bg-muted rounded-lg overflow-hidden">
              <img
                data-testid="media-image"
                src={getMediaUrl(media.url)}
                alt={media.altText || media.title || media.originalName}
                className="w-full h-auto max-h-[500px] object-contain"
              />
            </div>

            {/* Image info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('media.dimensions')}:
                </span>
                <span className="font-medium">
                  {media.width} × {media.height}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('media.fileSize')}:
                </span>
                <span className="font-medium">
                  {formatFileSize(media.sizeBytes)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t('media.uploadedAt')}:
                </span>
                <span className="font-medium">
                  {new Date(media.createdAt).toLocaleDateString()}
                </span>
              </div>
              {media.contextType && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {t('media.usedIn')}:
                  </span>
                  <Badge variant="secondary">
                    {t(`media.${media.contextType}`)}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Metadata form */}
          <div className="space-y-4">
            {editing ? (
              <>
                <div>
                  <Label htmlFor="edit-title">{t('media.imageTitle')}</Label>
                  <Input
                    data-testid="edit-title-input"
                    id="edit-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('media.titlePlaceholder')}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-altText">{t('media.altText')}</Label>
                  <Input
                    data-testid="edit-alttext-input"
                    id="edit-altText"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder={t('media.altTextPlaceholder')}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-tags">{t('media.tags')}</Label>
                  <Input
                    data-testid="edit-tags-input"
                    id="edit-tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder={t('media.tagsPlaceholder')}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('media.tagsHelp')}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      setTitle(media.title || '');
                      setAltText(media.altText || '');
                      setTags(media.tags.join(', '));
                    }}
                    disabled={saving}>
                    <X className="mr-2 h-4 w-4" />
                    {t('common.cancel')}
                  </Button>
                  <Button
                    data-testid="save-button"
                    onClick={handleSave}
                    disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? t('common.saving') : t('common.save')}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label>{t('media.imageTitle')}</Label>
                  <p className="text-sm mt-1">
                    {media.title || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </p>
                </div>

                <div>
                  <Label>{t('media.altText')}</Label>
                  <p className="text-sm mt-1">
                    {media.altText || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </p>
                </div>

                <div>
                  <Label>{t('media.tags')}</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {media.tags.length > 0 ? (
                      media.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </div>
                </div>

                <div>
                  <Label>{t('media.filename')}</Label>
                  <p className="text-sm mt-1 font-mono break-all">
                    {media.filename}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="justify-between">
          <Button
            data-testid="delete-button"
            variant="destructive"
            onClick={handleDelete}
            disabled={saving}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t('common.delete')}
          </Button>
          <Button variant="outline" onClick={onClose}>
            {t('common.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
