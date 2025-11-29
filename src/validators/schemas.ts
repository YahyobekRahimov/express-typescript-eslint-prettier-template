import { z } from "zod";

// Auth schemas
export const SignInSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type SignInInput = z.infer<typeof SignInSchema>;

// User schemas
export const CreateUserSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserPasswordSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type UpdateUserPasswordInput = z.infer<typeof UpdateUserPasswordSchema>;

// Delegate schemas
export const CreateDelegateSchema = z.object({
  badge_id: z.string().min(1, "Badge ID is required"),
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().nullable(),
  job_title: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
});

export type CreateDelegateInput = z.infer<typeof CreateDelegateSchema>;

export const UpdateDelegateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional().nullable(),
  job_title: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
});

export type UpdateDelegateInput = z.infer<typeof UpdateDelegateSchema>;

// Startup schemas
export const CreateStartupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().nullable(),
  description: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  booth_number: z.string().optional().nullable(),
});

export type CreateStartupInput = z.infer<typeof CreateStartupSchema>;

export const UpdateStartupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional().nullable(),
  description: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  booth_number: z.string().optional().nullable(),
});

export type UpdateStartupInput = z.infer<typeof UpdateStartupSchema>;

// Recommendation schemas
export const CreateRecommendationSchema = z.object({
  delegate_id: z
    .number()
    .int()
    .positive("Delegate ID must be a positive integer"),
  startup_id: z
    .number()
    .int()
    .positive("Startup ID must be a positive integer"),
});

export type CreateRecommendationInput = z.infer<
  typeof CreateRecommendationSchema
>;

// Scan log schemas
export const CreateScanLogSchema = z.object({
  delegate_id: z
    .number()
    .int()
    .positive("Delegate ID must be a positive integer"),
});

export type CreateScanLogInput = z.infer<typeof CreateScanLogSchema>;
