import { z } from 'zod';

export const webhookSchema = z.object({
  name: z.string().min(2, 'Webhook name must be at least 2 characters'),
  url: z.string().url('Invalid URL'),
  events: z.array(z.string()).min(1, 'At least one event is required'),
  headers: z.record(z.string(), z.string()).optional(),
  maxRetries: z.number().min(0).max(10).default(3),
  timeoutSeconds: z.number().min(1).max(300).default(30),
});

export type WebhookFormData = z.infer<typeof webhookSchema>;
