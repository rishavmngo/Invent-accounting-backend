import { z } from "zod";

export const CredentialsSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

export type Credential = z.infer<typeof CredentialsSchema>;

export const RegistrationSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().optional(),
  password: z.string().min(8, "Password must contain at least 8 characters"),
});

export type RegistrationInfo = z.infer<typeof RegistrationSchema>;
