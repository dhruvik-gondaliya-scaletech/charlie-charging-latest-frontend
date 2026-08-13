'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PermissionMatrix } from '@/features/rbac/components/PermissionMatrix';
import { useRoleById, usePermissions } from '@/hooks/get/useRbac';
import { useUpdateRole } from '@/hooks/put/useUpdateRole';
import { FRONTEND_ROUTES } from '@/constants/constants';
import { BackButton } from '@/components/shared/BackButton';
import { createRoleSchema, type CreateRoleFormValues } from '@/lib/validations/rbac';

interface RoleUpdateContainerProps {
  roleId: string;
}

export function RoleUpdateContainer({ roleId }: RoleUpdateContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: role, isLoading: roleLoading, isError, refetch } = useRoleById(roleId);
  const { data: allPermissions, isLoading: permsLoading } = usePermissions();
  const updateMutation = useUpdateRole();

  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: '',
      description: '',
      permissionCodes: [],
    },
  });

  const formattedName = role?.name
    ? role.name
      .split('_')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
    : '';

  useEffect(() => {
    if (role && formattedName) {
      if (searchParams.get('name') !== formattedName) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('name', formattedName);
        router.replace(`${pathname}?${params.toString()}`);
      }
    }
  }, [role, formattedName, pathname, searchParams, router]);

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description ?? '',
        permissionCodes: role.permissions?.map((p) => p.code) ?? 
          (role as any).rolePermissions?.map((rp: any) => rp.permission?.code).filter(Boolean) ?? [],
      });
    }
  }, [role, form]);

  const handleSubmit = (values: CreateRoleFormValues) => {
    updateMutation.mutate(
      { id: roleId, dto: values },
      {
        onSuccess: (data) => {
          const roleName = data?.name || values.name || '';
          const formattedName = roleName.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
          router.push(`${FRONTEND_ROUTES.RBAC_ROLE_DETAIL(roleId)}?name=${encodeURIComponent(formattedName)}`);
        }
      },
    );
  };

  if (roleLoading || permsLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground/60">
        <Loader2 className="h-6 w-6 animate-spin mr-3" />
        Loading role...
      </div>
    );
  }

  if (isError || !role) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">Failed to load role. Please try again.</p>
        <Button variant="ghost" onClick={() => refetch()} className="text-muted-foreground">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (role.isSystem) {
    return (
      <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-4">
          <BackButton
            href={`${FRONTEND_ROUTES.RBAC_ROLE_DETAIL(roleId)}?name=${encodeURIComponent(formattedName)}`}
            label="Return to Role Details"
          />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent uppercase">
              View
            </h1>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/30 backdrop-blur-sm p-6">
          <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning mb-5">
            System roles cannot be modified. Permissions are shown in read-only mode.
          </div>
          <h2 className="text-sm font-semibold text-foreground/70 mb-5">Permissions</h2>
          <PermissionMatrix
            allPermissions={allPermissions ?? []}
            selected={role.permissions?.map((p) => p.code) ?? 
              (role as any).rolePermissions?.map((rp: any) => rp.permission?.code).filter(Boolean) ?? []}
            editable={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <BackButton
          href={`${FRONTEND_ROUTES.RBAC_ROLE_DETAIL(roleId)}?name=${encodeURIComponent(formattedName)}`}
          label="Return to Role Details"
        />

        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent uppercase">
            Edit
          </h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8" noValidate>
          {/* Grid Layout for Form & Permissions Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Name/description form */}
            <div className="lg:col-span-1 rounded-xl border border-border bg-card/30 backdrop-blur-sm p-6 space-y-6">
              <h2 className="text-sm font-semibold text-foreground/70">Role Details</h2>
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground ml-1">Role Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Billing Manager"
                          className="bg-secondary/20 dark:bg-white/5 border-border dark:border-white/10 text-foreground placeholder:text-muted-foreground/30 focus:border-primary/60"
                          aria-invalid={!!form.formState.errors.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground ml-1">
                        Description{' '}
                        <span className="text-muted-foreground/50 font-normal">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe what this role can do…"
                          rows={3}
                          className="bg-secondary/20 dark:bg-white/5 border-border dark:border-white/10 text-foreground placeholder:text-muted-foreground/30 focus:border-primary/60 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>

            {/* Permissions matrix */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card/30 backdrop-blur-sm p-6 space-y-6">
              <div>
                <h2 className="text-sm font-semibold text-foreground/70 mb-1">Permissions</h2>
                <p className="text-xs text-muted-foreground">Select the permissions that will be assigned to this role</p>
              </div>

              <FormField
                control={form.control}
                name="permissionCodes"
                render={({ field }) => (
                  <PermissionMatrix
                    allPermissions={allPermissions ?? []}
                    selected={field.value ?? []}
                    editable={true}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
