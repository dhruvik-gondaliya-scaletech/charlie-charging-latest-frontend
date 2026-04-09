'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from './Breadcrumbs';

export function Header() {
  const { theme, setTheme } = useTheme();


  return (
    <header className="border-b bg-card h-[101px] flex items-center shrink-0">
      <div className="flex items-center justify-between px-6 w-full">
        <div className="flex items-center gap-4">
          <Breadcrumbs />
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

        </div>
      </div>
    </header>
  );
}
