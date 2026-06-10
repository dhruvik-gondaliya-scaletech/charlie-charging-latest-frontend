'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from './Breadcrumbs';
import { BrandLogo } from './BrandLogo';
import { useEnvironment } from '@/contexts/EnvironmentContext';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { environment, setEnvironment } = useEnvironment();

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

        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Breadcrumbs />
          </div>

          <div className="relative flex items-center bg-muted rounded-full p-0.5 h-8 md:h-9 text-[10px] md:text-xs font-bold select-none border">
            <button
              onClick={() => setEnvironment('dev')}
              className={`relative z-10 px-3 py-1 rounded-full transition-colors duration-200 cursor-pointer ${environment === 'dev'
                  ? 'text-white dark:text-black'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              DEV
            </button>
            <button
              onClick={() => setEnvironment('prod')}
              className={`relative z-10 px-3 py-1 rounded-full transition-colors duration-200 cursor-pointer ${environment === 'prod'
                  ? 'text-white dark:text-black'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              PROD
            </button>
            <div
              className="absolute top-0.5 bottom-0.5 rounded-full bg-primary transition-all duration-200 ease-in-out"
              style={{
                left: environment === 'dev' ? '2px' : '50%',
                width: 'calc(50% - 2px)',
              }}
            />
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
