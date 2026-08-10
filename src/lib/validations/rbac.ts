import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must be at most 50 characters')
    .regex(/^[A-Za-z0-9_\- ]+$/, 'Only letters, numbers, spaces, underscores and hyphens allowed'),
  description: z
    .string()
    .max(200, 'Description must be at most 200 characters')
    .optional()
    .or(z.literal('')),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = createRoleSchema.partial();
export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;

export const assignPermissionsSchema = z.object({
  permissionCodes: z
    .array(z.string())
    .min(1, 'Select at least one permission'),
});

export type AssignPermissionsFormValues = z.infer<typeof assignPermissionsSchema>;

export const assignRoleSchema = z.object({
  roleId: z.string().uuid('Please select a valid role'),
});

export type AssignRoleFormValues = z.infer<typeof assignRoleSchema>;

export const assignLocationsSchema = z.object({
  locationIds: z
    .array(z.string().uuid())
    .min(1, 'Select at least one location'),
});

export type AssignLocationsFormValues = z.infer<typeof assignLocationsSchema>;
