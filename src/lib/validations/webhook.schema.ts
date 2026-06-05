import { z } from 'zod';
import { WebhookEvent } from '@/types';

export const webhookSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  url: z.string().url('Invalid URL format').min(1, 'URL is required'),
  events: z.array(z.nativeEnum(WebhookEvent)).min(1, 'At least one event must be selected'),
  isActive: z.boolean(),
  maxRetries: z.number().int().min(0).max(10),
  timeoutSeconds: z.number().int().min(1).max(60),
  headers: z.record(z.string(), z.string()).optional(),
});

export type WebhookFormData = z.infer<typeof webhookSchema>;
