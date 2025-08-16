import { z } from "zod";

export const leadSchema = z.object({
  firstname: z.string().min(1, "First name is required").max(255),
  lastname: z.string().min(1, "Last name is required").max(255),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(1, "Phone number is required").max(20),
  message: z.string().optional(),
  officeId: z.number().int().positive("Office ID is required"),
  token: z.string().min(1, "reCAPTCHA token is required"),
});

export type LeadPayload = z.infer<typeof leadSchema>;
