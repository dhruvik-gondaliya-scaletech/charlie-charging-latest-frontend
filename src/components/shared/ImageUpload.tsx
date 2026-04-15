'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUploadImage } from '@/hooks/post/useUploadImage';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const uploadMutation = useUploadImage();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      return;
    }

    try {
      const result = await uploadMutation.mutateAsync(file);
      onChange(result.url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div 
      className={cn("relative group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative h-40 w-full rounded-2xl border-2 border-dashed border-border/40 bg-muted/20 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
          !value && "hover:border-primary/40 hover:bg-primary/5",
          uploadMutation.isPending && "pointer-events-none opacity-70"
        )}
      >
        {uploadMutation.isPending ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Uploading...</span>
          </div>
        ) : value ? (
          <>
            <div className="relative h-full w-full">
              <Image
                src={value}
                alt="Uploaded logo"
                fill
                className="object-contain p-4"
              />
            </div>
            {isHovered && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center transition-all">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg font-bold text-[10px] uppercase tracking-widest"
                  >
                    Change Image
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-lg shadow-lg shadow-destructive/20"
                    onClick={handleRemove}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
            <div className="h-12 w-12 rounded-xl bg-background border border-border/40 flex items-center justify-center shadow-sm">
              <Upload className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold tracking-tight">Click to upload logo</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">PNG, JPG or WebP (Max 5MB)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
