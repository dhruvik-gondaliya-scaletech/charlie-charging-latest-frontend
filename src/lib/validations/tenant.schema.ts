import { z } from 'zod';

export const tenantSchema = z.object({
  name: z.string().min(2, 'Tenant name must be at least 2 characters'),
  adminEmail: z.string().email('Invalid email address'),
  adminPassword: z.string().min(8, 'Password must be at least 8 characters'),
  adminFirstName: z.string().min(2, 'First name must be at least 2 characters'),
  adminLastName: z.string().min(2, 'Last name must be at least 2 characters'),
});

export type TenantFormData = z.infer<typeof tenantSchema>;
