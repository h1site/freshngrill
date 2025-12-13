'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';

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
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

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
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    } else {
      setError('Veuillez déposer une image valide');
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
          accept="image/jpeg,image/png,image/webp,image/gif"
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
              JPG, PNG, WebP ou GIF (max 5MB)
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
