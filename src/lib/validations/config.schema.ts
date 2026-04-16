import { z } from 'zod';

export const SupportContactSchema = z.object({
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const DriverAppConfigSchema = z.object({
  appName: z.string().min(1, 'App name is required').max(50, 'App name is too long'),
  logoUrl: z.string().url('Invalid logo URL').optional().or(z.literal('')),
  domain: z.string().min(3, 'Domain is required').regex(/^[a-z0-9][a-z0-9-.]*[a-z0-9]$/, 'Invalid domain format'),
  supportContact: SupportContactSchema.optional(),
});

export type DriverAppConfigValues = z.infer<typeof DriverAppConfigSchema>;
