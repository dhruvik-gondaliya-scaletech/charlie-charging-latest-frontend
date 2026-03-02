import { z } from 'zod';

export const locationSchema = z.object({
  name: z.string().min(2, 'Location name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  zipCode: z.string().min(3, 'Zip code must be at least 3 characters'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isActive: z.boolean(),
});

export type LocationFormData = z.infer<typeof locationSchema>;
