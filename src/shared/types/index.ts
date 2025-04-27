import { z } from "zod";

export const BaseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
