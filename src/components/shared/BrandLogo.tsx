'use client';

import * as React from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ASSETS } from '@/assets/assets';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'light' | 'dark';
}

export function BrandLogo({ className, width = 160, height = 60, variant }: BrandLogoProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch by only rendering after mounting
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width, height }} className={cn("animate-pulse bg-muted/20 rounded-lg", className)} />;
  }

  const currentTheme = variant || resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width, height }}>
      <Image
        src={isDark ? ASSETS.LOGOS.DARK : ASSETS.LOGOS.LIGHT}
        alt="Charli Charging Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
