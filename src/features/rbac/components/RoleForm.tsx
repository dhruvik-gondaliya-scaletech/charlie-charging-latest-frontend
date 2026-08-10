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

interface RoleFormProps {
  mode: 'create' | 'edit';
  defaultValues?: UpdateRoleFormValues;
  onSubmit: (values: CreateRoleFormValues) => void;
  isLoading?: boolean;
}

export function RoleForm({ mode, defaultValues, onSubmit, isLoading }: RoleFormProps) {
  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/80">Role Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Billing Manager"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/60"
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
              <FormLabel className="text-white/80">
                Description{' '}
                <span className="text-white/40 font-normal">(optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe what this role can do…"
                  rows={3}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/60 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Create Role' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
