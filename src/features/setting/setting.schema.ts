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
