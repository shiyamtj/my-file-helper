import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { formatFileSize, checkFileSizeWarning, validateFileSize } from '../../utils/fileUtils';
import Alert from './Alert';

const FileUpload = ({ onFilesSelected, accept, maxFiles = 10, maxSizeMB = 100 }) => {
  const [files, setFiles] = useState([]);
  const [warning, setWarning] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const validFiles = [];
    let hasWarning = false;

    acceptedFiles.forEach((file) => {
      const validation = validateFileSize(file, maxSizeMB);
      if (!validation.valid) {
        setWarning({ variant: 'destructive', message: validation.message });
        return;
      }

      const sizeCheck = checkFileSizeWarning(file);
      if (sizeCheck.shouldWarn) {
        hasWarning = true;
      }

      validFiles.push(file);
    });

    if (hasWarning) {
      setWarning({ variant: 'warning', message: 'Large files detected. Processing may take longer.' });
    } else {
      setWarning(null);
    }

    setFiles(validFiles);
    onFilesSelected(validFiles);
  }, [onFilesSelected, maxSizeMB]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    multiple: maxFiles > 1,
  });

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return ImageIcon;
    if (file.type === 'application/pdf') return FileText;
    return FileText;
  };

  return (
    <div className="w-full">
      {warning && (
        <Alert variant={warning.variant} onDismiss={() => setWarning(null)} className="mb-4">
          {warning.message}
        </Alert>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-xs text-muted-foreground">
          Max {maxFiles} file{maxFiles > 1 ? 's' : ''}, up to {maxSizeMB}MB each
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => {
            const Icon = getFileIcon(file);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-destructive/10 rounded transition-colors"
                >
                  <X className="h-4 w-4 text-destructive" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
