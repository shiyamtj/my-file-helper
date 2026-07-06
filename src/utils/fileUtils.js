export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const estimateProcessingTime = (fileSize) => {
  // Rough estimate: 1MB takes ~100ms to process
  const sizeInMB = fileSize / (1024 * 1024);
  const timeInSeconds = (sizeInMB * 0.1).toFixed(1);
  return timeInSeconds;
};

export const validateFileSize = (file, maxSizeMB = 100) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      message: `File size exceeds ${maxSizeMB}MB limit`
    };
  }
  return { valid: true };
};

export const checkFileSizeWarning = (file, warningSizeMB = 50) => {
  const warningSizeBytes = warningSizeMB * 1024 * 1024;
  if (file.size > warningSizeBytes) {
    return {
      shouldWarn: true,
      message: `Large file detected (${formatFileSize(file.size)}). Processing may take ${estimateProcessingTime(file.size)} seconds.`
    };
  }
  return { shouldWarn: false };
};
