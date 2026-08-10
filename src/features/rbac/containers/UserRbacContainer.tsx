'use client';

import { useUserRoles, useUserLocations, useUserEffectivePermissions, useRoles } from '@/hooks/get/useRbac';
import { useLocations } from '@/hooks/get/useLocations';
import { UserRolesPanel } from '@/features/rbac/components/UserRolesPanel';
import { UserLocationsPanel } from '@/features/rbac/components/UserLocationsPanel';
import { UserEffectivePermissions } from '@/features/rbac/components/UserEffectivePermissions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Location } from '@/types';
import { Shield, MapPin, Key } from 'lucide-react';

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
    <Tabs defaultValue={isSuperAdmin ? 'roles' : 'locations'} className="w-full">
      <TabsList className="bg-white/5 border border-white/10 p-1 rounded-lg">
        {isSuperAdmin && (
          <TabsTrigger
            value="roles"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-white/60 gap-2"
          >
            <Shield className="h-4 w-4" />
            Roles
          </TabsTrigger>
        )}
        <TabsTrigger
          value="locations"
          className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-white/60 gap-2"
        >
          <MapPin className="h-4 w-4" />
          Locations
        </TabsTrigger>
        <TabsTrigger
          value="permissions"
          className="data-[state=active]:bg-slate-600 data-[state=active]:text-white text-white/60 gap-2"
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
  );
}
