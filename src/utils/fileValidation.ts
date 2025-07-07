// File validation utilities
export interface FileValidationOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  maxFiles?: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Default validation options
const DEFAULT_OPTIONS: FileValidationOptions = {
  maxSizeMB: 3,
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  maxFiles: 1,
};

// Validate single file
export const validateFile = (file: File, options: FileValidationOptions = {}): ValidationResult => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Check file type
  if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${opts.allowedTypes.join(', ')}`
    };
  }
  
  // Check file size
  if (opts.maxSizeMB) {
    const maxSizeBytes = opts.maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        error: `File size must be less than ${opts.maxSizeMB}MB. Current file: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
      };
    }
  }
  
  return { isValid: true };
};

// Validate multiple files
export const validateFiles = (files: File[], options: FileValidationOptions = {}): ValidationResult => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Check number of files
  if (opts.maxFiles && files.length > opts.maxFiles) {
    return {
      isValid: false,
      error: `Maximum ${opts.maxFiles} file(s) allowed. Selected: ${files.length}`
    };
  }
  
  // Check total file size
  if (opts.maxSizeMB) {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const maxTotalSize = opts.maxSizeMB * 1024 * 1024;
    if (totalSize > maxTotalSize) {
      return {
        isValid: false,
        error: `Total file size (${(totalSize / (1024 * 1024)).toFixed(2)}MB) exceeds the limit of ${opts.maxSizeMB}MB`
      };
    }
  }
  
  // Validate each file
  for (const file of files) {
    const result = validateFile(file, options);
    if (!result.isValid) {
      return result;
    }
  }
  
  return { isValid: true };
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file extension from filename
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Check if file is an image
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
}; 