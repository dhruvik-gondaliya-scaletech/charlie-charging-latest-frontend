import { z } from 'zod';

export const tariffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  pricePerKwh: z.coerce.number().min(0, 'Price per kWh must be 0 or greater'),
  serviceFeePercentage: z.coerce.number().min(0, 'Service fee must be 0 or greater').max(100, 'Service fee cannot exceed 100%'),
  connectionFee: z.coerce.number().min(0, 'Connection fee must be 0 or greater'),
  idleFee: z.coerce.number().min(0, 'Idle fee must be 0 or greater'),
  currency: z.string().min(1, 'Currency is required'),
});

export type TariffFormData = z.infer<typeof tariffSchema>;
