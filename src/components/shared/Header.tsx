'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from './Breadcrumbs';

export function Header() {
  const { theme, setTheme } = useTheme();


  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between px-6 py-4">
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
