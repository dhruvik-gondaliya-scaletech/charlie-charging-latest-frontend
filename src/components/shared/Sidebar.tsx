'use client';

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
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin, isSuperAdmin } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FRONTEND_ROUTES } from '@/constants/constants';

const navItems = [
  { href: FRONTEND_ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, roles: ['user', 'admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.STATIONS, label: 'Stations', icon: Zap, roles: ['user', 'admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.LOCATIONS, label: 'Locations', icon: MapPin, roles: ['user','admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.USERS, label: 'Users', icon: Users, roles: ['user','admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.WEBHOOKS, label: 'Webhooks', icon: Webhook, roles: ['user','admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.TENANTS, label: 'Tenants', icon: Building2, roles: ['super_admin'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const canAccessRoute = (requiredRoles: string[]) => {
    if (!user?.role) return false;
    return requiredRoles.includes(user.role);
  };

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-6">
        <h1 className="text-2xl font-bold">CSMS</h1>
        <p className="text-sm text-muted-foreground">Charging Station Management</p>
      </div>

      <Separator />

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          if (!canAccessRoute(item.roles)) return null;

          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
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
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="p-4 space-y-2">
        <Link href={FRONTEND_ROUTES.PROFILE}>
          <motion.div
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
              pathname === FRONTEND_ROUTES.PROFILE
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <User className="h-5 w-5" />
            <span className="font-medium">Profile</span>
          </motion.div>
        </Link>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
}
