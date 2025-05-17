import React, { useRef, useState } from 'react';
import { Paperclip, X, FileText, Image, Film, Music, File } from 'lucide-react';
import { validateFile, MAX_FILE_SIZE, SUPPORTED_FILE_TYPES } from '../services/chatService';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  attachments: File[];
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  onFileRemove,
  attachments,
  disabled
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        newFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
      setTimeout(() => setError(null), 5000);
    }

    if (newFiles.length > 0) {
      onFilesSelected(newFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.startsWith('video/')) return <Film className="h-4 w-4" />;
    if (type.startsWith('audio/')) return <Music className="h-4 w-4" />;
    if (type.startsWith('text/') || type.includes('document')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        multiple
        accept={Object.keys(SUPPORTED_FILE_TYPES).join(',')}
        disabled={disabled}
      />

      <div 
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative ${isDragging ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
      >
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors duration-200"
          title="Прикрепить файл"
          disabled={disabled}
        >
          <Paperclip className="h-5 w-5" />
        </button>

        {isDragging && (
          <div className="absolute inset-0 border-2 border-dashed border-primary-400 dark:border-primary-600 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <span className="text-primary-600 dark:text-primary-400">
              Перетащите файлы сюда
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-500 dark:text-red-400">
          {error}
        </div>
      )}

      {attachments.length > 0 && (
        <div className="mt-2 space-y-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {file.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.size)}
                </div>
              </div>
              <button
                onClick={() => onFileRemove(index)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                title="Удалить файл"
              >
                <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;