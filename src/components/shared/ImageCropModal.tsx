'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnimatedModal } from './AnimatedModal';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Move, Crop, RefreshCw, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
}

type AspectRatioType = 'landscape' | 'square';

export function ImageCropModal({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
}: ImageCropModalProps) {
  const [aspect, setAspect] = useState<AspectRatioType>('landscape');
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Crop frame dimensions based on aspect ratio
  const frameWidth = aspect === 'landscape' ? 300 : 200;
  const frameHeight = aspect === 'landscape' ? 100 : 200;

  // Calculate base width and height to fit the frame (equivalent to object-cover)
  let baseWidth = 0;
  let baseHeight = 0;

  if (naturalSize.width && naturalSize.height) {
    const imgAspect = naturalSize.width / naturalSize.height;
    const frameAspect = frameWidth / frameHeight;

    if (imgAspect > frameAspect) {
      baseHeight = frameHeight;
      baseWidth = frameHeight * imgAspect;
    } else {
      baseWidth = frameWidth;
      baseHeight = frameWidth / imgAspect;
    }
  }

  // Bounding limits
  const maxDx = Math.max(0, (baseWidth * zoom - frameWidth) / 2);
  const maxDy = Math.max(0, (baseHeight * zoom - frameHeight) / 2);

  // Clamp helper
  const clamp = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);

  // Clamp offsets whenever zoom or frame size changes
  useEffect(() => {
    setOffset((prev) => ({
      x: clamp(prev.x, -maxDx, maxDx),
      y: clamp(prev.y, -maxDy, maxDy),
    }));
  }, [zoom, aspect, maxDx, maxDy]);

  // Reset state when opening/changing image
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setAspect('landscape');
    }
  }, [isOpen, imageSrc]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setNaturalSize({ width: naturalWidth, height: naturalHeight });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setOffset({
      x: clamp(newX, -maxDx, maxDx),
      y: clamp(newY, -maxDy, maxDy),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    setOffset({
      x: clamp(newX, -maxDx, maxDx),
      y: clamp(newY, -maxDy, maxDy),
    });
  };

  const handleCrop = () => {
    const img = imgRef.current;
    if (!img || !naturalSize.width || !naturalSize.height) return;

    const canvas = document.createElement('canvas');
    
    // Output size: landscape 600x200, square 400x400
    const targetWidth = aspect === 'landscape' ? 600 : 400;
    const targetHeight = aspect === 'landscape' ? 200 : 400;
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // S is the scale factor from preview frame coordinates to canvas output coordinates
    const S = targetWidth / frameWidth;

    // Apply translations relative to the center of the target canvas
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.translate(offset.x * S, offset.y * S);
    ctx.scale(zoom * S, zoom * S);

    // Draw the image centered
    ctx.drawImage(
      img,
      -baseWidth / 2,
      -baseHeight / 2,
      baseWidth,
      baseHeight
    );

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob);
          onClose();
        }
      },
      'image/png',
      1.0
    );
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Logo Framing"
      description="Drag the image and adjust the zoom slider to crop it perfectly."
      size="md"
    >
      <div className="space-y-6">
        {/* Aspect Ratio Selector */}
        <div className="flex justify-between items-center bg-muted/40 p-1.5 rounded-xl border border-border/40">
          <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground ml-2">
            Framing Style
          </div>
          <div className="flex gap-1">
            <Button
              type="button"
              variant={aspect === 'landscape' ? 'secondary' : 'ghost'}
              className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider px-3"
              onClick={() => setAspect('landscape')}
            >
              Landscape (3:1)
            </Button>
            <Button
              type="button"
              variant={aspect === 'square' ? 'secondary' : 'ghost'}
              className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-wider px-3"
              onClick={() => setAspect('square')}
            >
              Square (1:1)
            </Button>
          </div>
        </div>

        {/* Crop Container */}
        <div
          ref={containerRef}
          className="relative w-full h-[280px] bg-neutral-950 rounded-2xl overflow-hidden flex items-center justify-center cursor-move select-none border border-border/20 shadow-inner"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:16px_16px] opacity-40" />

          {/* Image */}
          {imageSrc && (
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop preview"
              onLoad={handleImageLoad}
              style={{
                width: baseWidth ? `${baseWidth}px` : 'auto',
                height: baseHeight ? `${baseHeight}px` : 'auto',
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                transformOrigin: 'center',
                maxWidth: 'none',
                maxHeight: 'none',
              }}
              className="transition-transform duration-75 pointer-events-none select-none shadow-xl"
            />
          )}

          {/* Mask Overlay with transparent crop frame */}
          <div
            style={{
              width: `${frameWidth}px`,
              height: `${frameHeight}px`,
            }}
            className="absolute pointer-events-none rounded-xl border-2 border-primary shadow-[0_0_0_9999px_rgba(10,10,12,0.8)] transition-all duration-200"
          >
            {/* Visual crop guidelines helper */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
              <div className="border-r border-b border-dashed border-white/40" />
              <div className="border-r border-b border-dashed border-white/40" />
              <div className="border-b border-dashed border-white/40" />
              <div className="border-r border-b border-dashed border-white/40" />
              <div className="border-r border-b border-dashed border-white/40" />
              <div className="border-b border-dashed border-white/40" />
              <div className="border-r border-dashed border-white/40" />
              <div className="border-r border-dashed border-white/40" />
              <div />
            </div>
          </div>

          {/* Center Drag Indicator */}
          <div className="absolute bottom-3 left-3 bg-neutral-900/80 backdrop-blur-md px-2 py-1 rounded-md text-[9px] font-bold text-white/60 flex items-center gap-1.5 border border-white/10 uppercase tracking-widest pointer-events-none">
            <Move className="h-3 w-3" /> Drag to position
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            <span>Zoom Level</span>
            <span>{Math.round(zoom * 100)}%</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-muted-foreground">A-</span>
            <Slider
              min={1}
              max={3}
              step={0.01}
              value={[zoom]}
              onValueChange={([val]) => setZoom(val)}
              className="flex-1 cursor-pointer"
            />
            <span className="text-[10px] font-black text-muted-foreground">A+</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl font-bold uppercase tracking-widest text-[10px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCrop}
            className="flex-1 h-11 rounded-xl font-bold uppercase tracking-widest text-[10px] bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/20"
          >
            Crop & Apply Logo
          </Button>
        </div>
      </div>
    </AnimatedModal>
  );
}
