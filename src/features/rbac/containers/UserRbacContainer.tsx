'use client';

import { useUserRoles, useUserLocations, useUserEffectivePermissions, useRoles } from '@/hooks/get/useRbac';
import { useLocations } from '@/hooks/get/useLocations';
import { UserRolesPanel } from '@/features/rbac/components/UserRolesPanel';
import { UserLocationsPanel } from '@/features/rbac/components/UserLocationsPanel';
import { UserEffectivePermissions } from '@/features/rbac/components/UserEffectivePermissions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Location } from '@/types';
import { Shield, MapPin, Key, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FRONTEND_ROUTES } from '@/constants/constants';

interface UserRbacContainerProps {
  userId: string;
}

export function UserRbacContainer({ userId }: UserRbacContainerProps) {
  const { isSuperAdmin } = useAuth();

  const { data: userRoles, isLoading: rolesLoading } = useUserRoles(userId);
  const { data: userLocations, isLoading: locationsLoading } = useUserLocations(userId);
  const { data: effectivePermissions, isLoading: permissionsLoading } =
    useUserEffectivePermissions(userId);

  const { data: allRoles } = useRoles();
  const { data: locationsResponse } = useLocations();

  // getAllLocations returns Location[] | PaginatedResponse<Location>
  const allLocations: Location[] = Array.isArray(locationsResponse)
    ? (locationsResponse as Location[])
    : ((locationsResponse as { data?: Location[] } | undefined)?.data ?? []);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8">
      {/* Back */}
      <Link href={FRONTEND_ROUTES.USERS}>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted border border-border">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Access Control
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1 tracking-tight">
            Manage roles and location scope for this user
          </p>
        </div>
      </div>

      {/* RBAC tabs */}
      <div className="rounded-xl border border-border bg-card/30 backdrop-blur-sm p-6">
        <Tabs defaultValue={isSuperAdmin ? 'roles' : 'locations'} className="w-full">
          <TabsList className="bg-muted border border-border p-1 rounded-lg">
            {isSuperAdmin && (
              <TabsTrigger
                value="roles"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground gap-2"
              >
                <Shield className="h-4 w-4" />
                Roles
              </TabsTrigger>
            )}
            <TabsTrigger
              value="locations"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground gap-2"
            >
              <MapPin className="h-4 w-4" />
              Locations
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground gap-2"
            >
              <Key className="h-4 w-4" />
              Permissions
            </TabsTrigger>
          </TabsList>

          {isSuperAdmin && (
            <TabsContent value="roles" className="mt-6">
              <UserRolesPanel
                userId={userId}
                assignments={userRoles ?? []}
                availableRoles={allRoles ?? []}
                isLoading={rolesLoading}
              />
            </TabsContent>
          )}

          <TabsContent value="locations" className="mt-6">
            <UserLocationsPanel
              userId={userId}
              assignments={userLocations ?? []}
              availableLocations={allLocations}
              isLoading={locationsLoading}
            />
          </TabsContent>

          <TabsContent value="permissions" className="mt-6">
            <UserEffectivePermissions
              permissions={effectivePermissions?.permissions ?? []}
              isLoading={permissionsLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
