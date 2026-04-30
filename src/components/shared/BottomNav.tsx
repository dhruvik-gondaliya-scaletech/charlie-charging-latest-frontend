'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Zap,
  MapPin,
  User,
  MoreHorizontal,
  Users,
  CreditCard,
  Coins,
  Webhook,
  LogOut,
  UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FRONTEND_ROUTES } from '@/constants/constants';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

const mainNavItems = [
  { href: FRONTEND_ROUTES.DASHBOARD, label: 'Home', icon: LayoutDashboard },
  { href: FRONTEND_ROUTES.STATIONS, label: 'Stations', icon: Zap },
  { href: FRONTEND_ROUTES.LOCATIONS, label: 'Locations', icon: MapPin },
  { href: FRONTEND_ROUTES.PROFILE, label: 'Profile', icon: UserCircle },
];

const moreNavItems = [
  { href: FRONTEND_ROUTES.USERS, label: 'Operators', icon: Users, roles: ['admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.DRIVERS, label: 'Drivers', icon: User, roles: ['admin', 'super_admin'] },
  // { href: FRONTEND_ROUTES.ID_TAGS, label: 'ID Tags', icon: CreditCard, roles: ['admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.TARIFF, label: 'Tariff', icon: Coins, roles: ['admin', 'super_admin'] },
  { href: FRONTEND_ROUTES.WEBHOOKS, label: 'Webhooks', icon: Webhook, roles: ['admin', 'super_admin'] },
];

export function BottomNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = React.useState(false);

  const canAccessRoute = (requiredRoles: string[]) => {
    if (!user?.role) return false;
    return requiredRoles.includes(user.role);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t pb-safe">
      <div className="flex items-center justify-around h-16 pointer-events-auto">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== FRONTEND_ROUTES.DASHBOARD && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "p-1.5 rounded-xl transition-colors",
                  isActive && "bg-primary/10"
                )}
              >
                <Icon className="h-5 w-5" />
              </motion.div>
              <span className="text-[10px] font-bold tracking-tight uppercase">{item.label}</span>
            </Link>
          );
        })}

        <Drawer open={isMoreOpen} onOpenChange={setIsMoreOpen}>
          <DrawerTrigger asChild>
            <button className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-muted-foreground">
              <div className="p-1.5 rounded-xl">
                <MoreHorizontal className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold tracking-tight uppercase">More</span>
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
                <DrawerDescription>Access all management features</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 grid grid-cols-3 gap-4">
                {moreNavItems.map((item) => {
                  if (!canAccessRoute(item.roles)) return null;
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMoreOpen(false)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-accent"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-[10px] font-bold text-center">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
              <Separator className="my-2" />
              <DrawerFooter>
                <Button
                  variant="destructive"
                  className="w-full rounded-xl h-12 font-bold"
                  onClick={() => {
                    setIsMoreOpen(false);
                    logout();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full rounded-xl h-12 font-bold">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
