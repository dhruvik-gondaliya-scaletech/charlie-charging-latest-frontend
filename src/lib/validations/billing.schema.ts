import { z } from 'zod';

export const tariffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  pricePerKwh: z.coerce.number().min(0, 'Price per kWh must be 0 or greater'),
  serviceFeePercentage: z.coerce.number().min(0, 'Service fee must be 0 or greater').max(100, 'Service fee cannot exceed 100%'),
  connectionFee: z.coerce.number().min(0, 'Connection fee must be 0 or greater'),
  idleFeePerMinute: z.coerce.number().min(0, 'Idle fee must be 0 or greater'),
  isIdleFeeEnabled: z.boolean().default(false),
  idleGracePeriodMinutes: z.coerce.number().min(0, 'Grace period must be 0 or greater').default(0),
  maxIdleFee: z.coerce.number().min(0, 'Max idle fee must be 0 or greater').default(0),
  currency: z.enum(['USD', 'INR'], { message: 'Currency is required' }),
});

export type TariffFormData = z.infer<typeof tariffSchema>;
