import path from 'path';

export const MEDIA_CONFIG = {
  // File upload limits
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFilesPerUpload: 10,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],

  // Image processing
  thumbnailSize: 300, // 300x300 square
  maxImageDimension: 1920, // Max 1920px width/height
  jpegQuality: 85,
  thumbnailQuality: 70,

  // Storage paths
  uploadsDir: path.join(process.cwd(), 'data', 'uploads'),
  thumbnailsDir: path.join(process.cwd(), 'data', 'uploads', 'thumbnails'),

  // User quota
  userQuotaBytes: 1_073_741_824, // 1GB per user
};
