import * as z from "zod";

export const driverSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
});

export type DriverFormValues = z.infer<typeof driverSchema>;
