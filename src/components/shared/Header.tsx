'use client';

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from './Breadcrumbs';
import { BrandLogo } from './BrandLogo';
import { useEnvironment, isSiteManagerUser } from '@/contexts/EnvironmentContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Environment, FRONTEND_ROUTES } from '@/constants/constants';

const ALLOWED_ENV_SWITCH_ROUTES = [
  FRONTEND_ROUTES.DASHBOARD,
  FRONTEND_ROUTES.STATIONS,
  FRONTEND_ROUTES.LOCATIONS,
  FRONTEND_ROUTES.TARIFF,
  FRONTEND_ROUTES.REPORTS,
  FRONTEND_ROUTES.WEBHOOKS,
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const { environment, setEnvironment } = useEnvironment();
  const { user } = useAuth();
  const pathname = usePathname();
  const isSiteManager = isSiteManagerUser(user);

  const normalizedPathname = pathname ? pathname.replace(/\/$/, '') : '';
  const isSwitchAllowed = ALLOWED_ENV_SWITCH_ROUTES.includes(normalizedPathname);

  const handleEnvSwitch = (targetEnv: Environment) => {
    if (!isSwitchAllowed) {
      toast.warning(
        <span>
          Environment selection cannot be changed on this page. If you want to change it, please{' '}
          <Link
            href={FRONTEND_ROUTES.DASHBOARD}
            className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            click here to go to Dashboard
          </Link>
          .
        </span>
      );
      return;
    }
    if (environment !== targetEnv) {
      setEnvironment(targetEnv);
    }
  };

  return (
    <header className="border-b bg-card h-16 md:h-[101px] flex items-center shrink-0">
      <div className="flex items-center justify-between px-4 md:px-6 w-full">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="md:hidden">
            <BrandLogo width={120} height={40} />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Breadcrumbs />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isSiteManager && (
            <div className="relative flex items-center bg-muted rounded-full p-0.5 h-8 md:h-9 text-[10px] md:text-xs font-bold select-none border">
              <Button
                variant={null}
                size={null}
                onClick={() => handleEnvSwitch(Environment.DEV)}
                className={cn(
                  'relative z-10 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold transition-colors duration-200 cursor-pointer',
                  environment === Environment.DEV
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                DEV
              </Button>
              <Button
                variant={null}
                size={null}
                onClick={() => handleEnvSwitch(Environment.PROD)}
                className={cn(
                  'relative z-10 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold transition-colors duration-200 cursor-pointer',
                  environment === Environment.PROD
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                PROD
              </Button>
              <div
                className="absolute top-0.5 bottom-0.5 rounded-full bg-primary transition-all duration-200 ease-in-out"
                style={{
                  left: environment === Environment.DEV ? '2px' : '50%',
                  width: 'calc(50% - 2px)',
                }}
              />
            </div>
          )}

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
