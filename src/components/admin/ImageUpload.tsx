'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';

// Crop and resize image to a target aspect ratio and max dimensions
async function cropToAspectRatio(
  file: File,
  targetWidth: number,
  targetHeight: number,
  maxSizeMB: number = 4
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      const targetRatio = targetWidth / targetHeight;
      const imgRatio = img.width / img.height;

      let cropWidth = img.width;
      let cropHeight = img.height;
      let cropX = 0;
      let cropY = 0;

      if (imgRatio > targetRatio) {
        // Image is wider than target: crop sides
        cropWidth = img.height * targetRatio;
        cropX = (img.width - cropWidth) / 2;
      } else {
        // Image is taller than target: crop top/bottom
        cropHeight = img.width / targetRatio;
        cropY = (img.height - cropHeight) / 2;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx?.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, targetWidth, targetHeight);

      const tryCompress = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { reject(new Error('Failed to crop image')); return; }
            if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.3) {
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
            } else {
              tryCompress(quality - 0.1);
            }
          },
          'image/jpeg',
          quality
        );
      };
      tryCompress(0.92);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// Compress image client-side to fit Vercel's 4.5MB limit
async function compressImage(file: File, maxSizeMB: number = 4): Promise<File> {
  if (file.size <= maxSizeMB * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;
      const maxDim = 4000;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = (height / width) * maxDim;
          width = maxDim;
        } else {
          width = (width / height) * maxDim;
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      const tryCompress = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { reject(new Error('Failed to compress image')); return; }
            if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.3) {
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
            } else {
              tryCompress(quality - 0.1);
            }
          },
          'image/jpeg',
          quality
        );
      };
      tryCompress(0.92);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  /** Force crop to Pinterest ratio (1000x1500) */
  pinterest?: boolean;
}

export default function ImageUpload({ value, onChange, pinterest }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');

    const maxOriginalSizeMB = 50;
    if (file.size > maxOriginalSizeMB * 1024 * 1024) {
      setError(`Image too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum ${maxOriginalSizeMB}MB.`);
      return;
    }

    setIsUploading(true);

    try {
      let processedFile: File;

      if (pinterest) {
        // Crop to Pinterest ratio 2:3 (1000x1500)
        processedFile = await cropToAspectRatio(file, 1000, 1500, 4);
      } else {
        processedFile = await compressImage(file, 4);
      }

      console.log(`Original: ${(file.size / 1024 / 1024).toFixed(2)}MB, Processed: ${(processedFile.size / 1024 / 1024).toFixed(2)}MB${pinterest ? ' (Pinterest 1000x1500)' : ''}`);

      const formData = new FormData();
      formData.append('file', processedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text.includes('Request Entity Too Large')
          ? 'Image too large for upload. Try a smaller image.'
          : text.includes('FUNCTION_INVOCATION_TIMEOUT')
          ? 'Timeout. Image is too large to process.'
          : `Server error: ${text.substring(0, 100)}`);
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    } else {
      setError('Please drop a valid image file (JPG, PNG, WebP, etc.)');
    }
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const previewClass = pinterest ? 'w-40 h-60' : 'w-64 h-40';

  return (
    <div className="space-y-3">
      {/* Preview */}
      {value && (
        <div className="relative inline-block">
          <div className={`relative ${previewClass} rounded-lg overflow-hidden border border-gray-200`}>
            <Image src={value} alt="Preview" fill className="object-cover" unoptimized />
          </div>
          <button type="button" onClick={handleRemove} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragActive ? 'border-[#00bf63] bg-green-50' : 'border-gray-300 hover:border-gray-400'} ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-[#00bf63] animate-spin mb-2" />
            <p className="text-sm text-gray-600">Uploading{pinterest ? ' & cropping to Pinterest format' : ''}...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              <span className="text-[#00bf63] font-medium">Click to choose</span> or drag an image
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {pinterest ? 'Auto-cropped to Pinterest 2:3 ratio (1000x1500px)' : 'JPG, PNG, WebP (max 50MB, auto-compressed)'}
            </p>
          </div>
        )}
      </div>

      {/* Manual URL */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">or</span>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste an image URL..."
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-[#00bf63] focus:border-[#00bf63]"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
