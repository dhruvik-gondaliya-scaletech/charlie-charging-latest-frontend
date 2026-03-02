'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Breadcrumbs } from './Breadcrumbs';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, tenant } = useAuth();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

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

          <Avatar>
            <AvatarFallback>
              {getInitials(user?.firstName, user?.lastName)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
