'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';

// Compress image client-side to fit Vercel's 4.5MB limit
async function compressImage(file: File, maxSizeMB: number = 4): Promise<File> {
  // If already small enough, return as-is
  if (file.size <= maxSizeMB * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Calculate new dimensions (max 2000px)
      let { width, height } = img;
      const maxDim = 2000;
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

      // Try different quality levels until file is small enough
      const tryCompress = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.3) {
              const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
                type: 'image/jpeg',
              });
              resolve(compressedFile);
            } else {
              tryCompress(quality - 0.1);
            }
          },
          'image/jpeg',
          quality
        );
      };
      tryCompress(0.85);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');

    // Max original file size 50MB (will be compressed to fit Vercel's 4MB limit)
    const maxOriginalSizeMB = 50;
    if (file.size > maxOriginalSizeMB * 1024 * 1024) {
      setError(`Image trop volumineuse (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum ${maxOriginalSizeMB}MB.`);
      return;
    }

    setIsUploading(true);

    try {
      // Compress image if needed (Vercel limit is 4.5MB, we target 4MB)
      const compressedFile = await compressImage(file, 4);
      console.log(`Original: ${(file.size / 1024 / 1024).toFixed(2)}MB, Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

      const formData = new FormData();
      formData.append('file', compressedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      // Handle non-JSON responses (like Vercel errors)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Upload error (non-JSON):', text);
        throw new Error(text.includes('Request Entity Too Large')
          ? 'Image trop volumineuse pour Vercel. Essayez une image plus petite.'
          : text.includes('FUNCTION_INVOCATION_TIMEOUT')
          ? 'Timeout. L\'image est trop grande à traiter. Essayez une image plus petite.'
          : `Erreur serveur: ${text.substring(0, 100)}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'upload');
      }

      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/heic', 'image/heif'];
    if (file && (file.type.startsWith('image/') || allowedTypes.some(t => file.name.toLowerCase().endsWith(t.split('/')[1])))) {
      handleFile(file);
    } else {
      setError('Veuillez déposer une image valide (JPG, PNG, WebP, GIF, AVIF ou HEIC)');
    }
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Image de la recette
      </label>

      {/* Preview de l'image existante */}
      {value && (
        <div className="relative inline-block">
          <div className="relative w-64 h-40 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Zone d'upload */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/heic,image/heif"
          onChange={handleInputChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-2" />
            <p className="text-sm text-gray-600">Upload en cours...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              <span className="text-orange-600 font-medium">Cliquez pour choisir</span> ou glissez une image
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WebP, GIF, AVIF ou HEIC (max 50MB, compressé automatiquement)
            </p>
          </div>
        )}
      </div>

      {/* Champ URL manuel (optionnel) */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">ou</span>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Coller une URL d'image..."
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      {/* Erreur */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
