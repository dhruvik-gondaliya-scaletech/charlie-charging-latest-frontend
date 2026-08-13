import { z } from 'zod';

export const userInvitationSchema = z.object({
  email: z.string().email('Invalid email address'),
  roleId: z.string().uuid('Role is required'),
  locationIds: z.array(z.string().uuid()).optional(),
});

export type UserInvitationData = z.infer<typeof userInvitationSchema>;

export const userProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional().nullable(),
  lastName: z.string().min(1, 'Last name is required').optional().nullable(),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional().nullable(),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional().nullable(),
  lastName: z.string().min(1, 'Last name is required').optional().nullable(),
  email: z.string().email('Invalid email address').optional(),
  phoneNumber: z.string().optional().nullable(),
  roleId: z.string().uuid('Role is required').optional(),
  locationIds: z.array(z.string().uuid()).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

