'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUploadImage } from '@/hooks/post/useUploadImage';
import { cn } from '@/lib/utils';
import { ImageCropModal } from './ImageCropModal';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
  description?: string;
  uploadingText?: string;
}

export function ImageUpload({ value, onChange, className, label, description, uploadingText }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadImage();

  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCropImageSrc(objectUrl);
    setIsCropModalOpen(true);
  };

  const handleCropComplete = async (blob: Blob) => {
    const file = new File([blob], 'logo.png', { type: 'image/png' });
    try {
      const result = await uploadMutation.mutateAsync(file);
      onChange(result.url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      cleanupCrop();
    }
  };

  const handleCropCancel = () => {
    cleanupCrop();
  };

  const cleanupCrop = () => {
    setIsCropModalOpen(false);
    if (cropImageSrc) {
      URL.revokeObjectURL(cropImageSrc);
      setCropImageSrc(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={cn("relative w-full", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Uploading loading overlay */}
      {uploadMutation.isPending && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 rounded-2xl z-20 border border-border/40">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{uploadingText || 'Uploading Logo...'}</span>
        </div>
      )}

      {value ? (
        /* Premium Horizontal Preview Layout */
        <div className="relative h-28 w-full rounded-2xl border border-border/40 bg-muted/10 flex items-center justify-between p-4 overflow-hidden group">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative h-20 w-32 rounded-xl border border-border/20 bg-neutral-900/60 flex items-center justify-center p-2 shrink-0">
              {/* Checkerboard transparent grid background helper */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,#161618_25%,transparent_25%),linear-gradient(-45deg,#161618_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#161618_75%),linear-gradient(-45deg,transparent_75%,#161618_75%)] bg-[size:8px_8px] bg-[position:0_0,0_0,4px_4px,4px_4px] opacity-35 rounded-xl" />
              <img
                src={value}
                alt="Uploaded asset"
                className="relative max-h-full max-w-full object-contain z-10"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{label || 'Active Logo'}</span>
              <span className="text-xs font-bold text-muted-foreground truncate">{description || 'White-Label Branding Asset'}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 rounded-xl font-bold text-[10px] uppercase tracking-wider cursor-pointer border-border/40 hover:bg-muted"
            >
              Change
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-9 w-9 rounded-xl shadow-lg shadow-destructive/20 cursor-pointer"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        /* Spacious Dashed Dropzone */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative h-36 w-full rounded-2xl border-2 border-dashed border-border/40 bg-muted/20 hover:border-primary/40 hover:bg-primary/5 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group"
        >
          <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
            <div className="h-11 w-11 rounded-xl bg-background border border-border/40 flex items-center justify-center shadow-sm">
              <Upload className="h-5 w-5" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold tracking-tight">Click to upload {label ? label.toLowerCase() : 'logo'}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">PNG, JPG or WebP (Max 5MB)</p>
            </div>
          </div>
        </div>
      )}

      {/* Image Crop Modal */}
      {cropImageSrc && (
        <ImageCropModal
          isOpen={isCropModalOpen}
          onClose={handleCropCancel}
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
