import { z } from "zod";

export const TemplateSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  template: z.string(),
  thumbnail: z.string(),
  premium: z.boolean(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
});

export type TemplateT = z.infer<typeof TemplateSchema>;

export const TemplateWithoutIdSchema = TemplateSchema.omit({
  id: true,
});

export type TemplateWithoutIdT = z.infer<typeof TemplateWithoutIdSchema>;

export const SettingsSchema = z.object({
  id: z.number(),
  owner_id: z.number().nullable(),
  logo_url: z.string().nullable(),
  template_id: z.number().nullable(),
  dark_mode: z.boolean().default(false),
  name: z.string().nullable(),
  contact_number: z.string().nullable(),
  address: z.string().nullable(),
  website: z.string().nullable(),
  signature_url: z.string().nullable(),
  created_at: z.coerce.date().nullable(),
  updated_at: z.coerce.date().nullable(),
});

export const SettingsWithoutIdSchema = SettingsSchema.omit({ id: true });

export type SettingsT = z.infer<typeof SettingsSchema>;
export type SettingsWithoutIdT = z.infer<typeof SettingsWithoutIdSchema>;
