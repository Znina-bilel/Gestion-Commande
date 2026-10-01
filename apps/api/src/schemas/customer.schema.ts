import { z } from "zod";

export const createCustomerSchema = z.object({
  firstName: z.string().trim().min(2).max(50),
  lastName: z.string().trim().min(2).max(50),
  email: z.string().trim().email(),
  phone: z.string().trim().min(8).max(20).optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = z.object({
  firstName: z.string().trim().min(2).max(50).optional(),
  lastName: z.string().trim().min(2).max(50).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().min(8).max(20).optional(),
});

export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;