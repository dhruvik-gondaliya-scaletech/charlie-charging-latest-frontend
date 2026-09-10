import * as z from "zod";

export const driverSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  locationId: z.string().min(1, "Location is required"),
});

export type DriverFormValues = z.infer<typeof driverSchema>;
