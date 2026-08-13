'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  createRoleSchema,
  CreateRoleFormValues,
  UpdateRoleFormValues,
} from '@/lib/validations/rbac';
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
import { usePermissions } from '@/hooks/get/useRbac';
import { PermissionMatrix } from './PermissionMatrix';

interface RoleFormProps {
  mode: 'create' | 'edit';
  defaultValues?: UpdateRoleFormValues & { permissionCodes?: string[] };
  onSubmit: (values: CreateRoleFormValues) => void;
  isLoading?: boolean;
}

export function RoleForm({ mode, defaultValues, onSubmit, isLoading }: RoleFormProps) {
  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      permissionCodes: defaultValues?.permissionCodes ?? [],
    },
  });

  const { data: allPermissions, isLoading: permsLoading } = usePermissions();

  const renderFields = () => (
    <>
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
                className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground/30 focus:border-primary/60"
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
                className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground/30 focus:border-primary/60 resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>
        {mode === 'create' ? (
          <>
            {/* Role Details */}
            <div className="space-y-5">
              <h2 className="text-base font-semibold text-foreground">Role Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                {renderFields()}
              </div>
            </div>

            {/* Permissions selection */}
            <div className="space-y-5 border-t border-white/10 pt-6">
              <div>
                <h2 className="text-base font-semibold text-foreground mb-1">Permissions</h2>
                <p className="text-sm text-muted-foreground">Select the permissions that will be assigned to this role</p>
              </div>
              {permsLoading ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground/40">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Loading permissions...
                </div>
              ) : (
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
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Role
              </Button>
            </div>
          </>
        ) : (
          /* Edit mode - rendered fields directly, styling is handled by the parent page wrapper */
          <>
            <div className="space-y-5">
              {renderFields()}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </>
        )}
      </form>
    </Form>
  );
}
