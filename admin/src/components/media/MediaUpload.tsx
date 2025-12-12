/**
 * MediaUpload Component
 * Dialog with drag & drop for uploading media files
 */

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { formatFileSize } from '@/lib/utils';
import type { UploadMediaInput } from '@/types/media';

interface MediaUploadProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: File[], input: UploadMediaInput) => Promise<void>;
  contextType?: 'tour' | 'poi' | 'standalone';
  contextId?: string;
}

interface FileWithPreview extends File {
  preview?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILES = 10;
const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

export function MediaUpload({
  open,
  onClose,
  onUpload,
  contextType = 'standalone',
  contextId,
}: MediaUploadProps) {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [tags, setTags] = useState('');

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Validate file size
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(
            t('media.fileTooLarge', {
              name: file.name,
              max: formatFileSize(MAX_FILE_SIZE),
            })
          );
          return false;
        }
        return true;
      });

      // Limit number of files
      if (files.length + validFiles.length > MAX_FILES) {
        toast.error(t('media.tooManyFiles', { max: MAX_FILES }));
        return;
      }

      // Create previews
      const filesWithPreviews = validFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles((prev) => [...prev, ...filesWithPreviews]);
    },
    [files.length, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: MAX_FILES,
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      // Revoke preview URL
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error(t('media.noFilesSelected'));
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const input: UploadMediaInput = {
        contextType,
        contextId,
      };

      if (title) input.title = title;
      if (altText) input.altText = altText;
      if (tags)
        input.tags = tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      await onUpload(files, input);

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success(t('media.uploadSuccess', { count: files.length }));

      // Cleanup and close
      files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
      setFiles([]);
      setTitle('');
      setAltText('');
      setTags('');
      onClose();
    } catch (error) {
      toast.error(t('media.uploadError'));
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        data-testid="upload-dialog"
        className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('media.upload')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dropzone */}
          <div
            data-testid="dropzone"
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}>
            <input data-testid="file-input" {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg font-medium">{t('media.dropHere')}</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-1">
                  {t('media.selectImages')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('media.maxFileSize', { size: '10MB' })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('media.maxFiles', { max: MAX_FILES })}
                </p>
              </>
            )}
          </div>

          {/* File previews */}
          {files.length > 0 && (
            <div
              data-testid="image-previews"
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  data-testid="image-preview"
                  className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    data-testid="remove-file"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Metadata inputs */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="title">{t('media.title')}</Label>
              <Input
                data-testid="title-input"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('media.titlePlaceholder')}
              />
            </div>

            <div>
              <Label htmlFor="altText">{t('media.altText')}</Label>
              <Input
                data-testid="alttext-input"
                id="altText"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder={t('media.altTextPlaceholder')}
              />
            </div>

            <div>
              <Label htmlFor="tags">{t('media.tags')}</Label>
              <Input
                data-testid="tags-input"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder={t('media.tagsPlaceholder')}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('media.tagsHelp')}
              </p>
            </div>
          </div>

          {/* Upload progress */}
          {uploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-center text-muted-foreground">
                {t('media.uploading')} {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            {t('common.cancel')}
          </Button>
          <Button
            data-testid="submit-upload"
            onClick={handleUpload}
            disabled={uploading || files.length === 0}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('media.uploading')}
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                {t('media.uploadFiles', { count: files.length })}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
