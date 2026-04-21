'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Zap,
  MapPin,
  Users,
  Webhook,
  Building2,
  User,
  CreditCard,
  Coins,
  LogOut,
  Share2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FRONTEND_ROUTES } from '@/constants/constants';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AnimatedModal } from './AnimatedModal';

const navItems = [
  { href: FRONTEND_ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, roles: ['user', 'admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.STATIONS, label: 'Stations', icon: Zap, roles: ['user', 'admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.LOCATIONS, label: 'Locations', icon: MapPin, roles: ['user', 'admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.USERS, label: 'Operators', icon: Users, roles: ['admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.DRIVERS, label: 'Drivers', icon: User, roles: ['admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.ID_TAGS, label: 'ID Tags', icon: CreditCard, roles: ['admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.TARIFF, label: 'Tariff', icon: Coins, roles: ['admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.WEBHOOKS, label: 'Webhooks', icon: Webhook, roles: ['admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.API_DOCS, label: 'API Docs', icon: Share2, roles: ['admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.TENANTS, label: 'Tenants', icon: Building2, roles: ['super_admin'] },
];

export function Sidebar() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName || !lastName) return 'U';
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const canAccessRoute = (requiredRoles: string[]) => {
    if (!user?.role) return false;
    return requiredRoles.includes(user.role);
  };

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-6 h-[100px] flex flex-col items-center justify-center text-center shrink-0">
        <h1 className="text-2xl font-bold">Scale EV</h1>
        {/* <p className="text-sm text-muted-foreground">Charging Station Management</p> */}
      </div>

      <Separator />

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          if (!canAccessRoute(item.roles)) return null;

          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          const navContent = (
            <motion.div
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </motion.div>
          );

          return (
            <div key={item.href}>
              {item.href === FRONTEND_ROUTES.API_DOCS ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {navContent}
                </a>
              ) : (
                <Link href={item.href}>
                  {navContent}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <Separator />

      <div className="p-4 mt-auto">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-accent transition-colors text-left group">
              <Avatar className="h-10 w-10 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {getInitials(user?.firstName, user?.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate leading-tight">
                  {user?.firstName || user?.lastName ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim() : 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2 rounded-2xl" side="right" align="end" sideOffset={12}>
            <div className="space-y-1">
              <Link href={FRONTEND_ROUTES.PROFILE}>
                <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium text-left cursor-pointer">
                  <User className="h-4 w-4" />
                  View Profile
                </button>
              </Link>
              <Separator className="my-1" />
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-medium text-left cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <AnimatedModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
        description="Are you sure you want to log out of your account? Your current session will be ended."
        footer={
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setIsLogoutModalOpen(false)}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={logout}
              className="flex-1 sm:flex-none"
            >
              Logout
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <LogOut className="h-10 w-10 text-destructive" />
          </div>
          <p className="text-muted-foreground">
            We&apos;ll be here waiting for your next session.
          </p>
        </div>
      </AnimatedModal>
    </div>
  );
}
