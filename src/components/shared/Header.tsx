'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from './Breadcrumbs';
import { BrandLogo } from './BrandLogo';

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b bg-card h-16 md:h-[101px] flex items-center shrink-0">
      <div className="flex items-center justify-between px-4 md:px-6 w-full">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="md:hidden">
            <BrandLogo width={120} height={40} />
          </div>
          <div className="hidden md:block">
            <Breadcrumbs />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="md:hidden">
            <Breadcrumbs />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:h-10 md:w-10"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <Moon className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
