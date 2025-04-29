import { z } from "zod";
import { BaseSchema, zodDate } from "../../shared/types";

// const zodDate = z.preprocess((arg) => {
//   if (typeof arg === "string" || arg instanceof Date) {
//     const parsed = new Date(arg);
//     if (!isNaN(parsed.getTime())) {
//       return parsed;
//     }
//   }
//   return undefined;
// }, z.date());

export const PartySchema = BaseSchema.extend({
  name: z.string(),
  user_id: z.number(),
  contact_number: z.string().optional(),
  billing_address: z.string().optional(),
  email_address: z.string().email().or(z.literal("")).optional(),
  state: z.string().optional(),
  gst_type: z.string().optional(),
  gstin: z.string().length(15).optional(),
  credit_limit: z.number().optional(),
});

export const newPartySchema = PartySchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const PartyFormSchema = newPartySchema.extend({
  opening_balance: z.number().optional(),
  as_of_date: zodDate.optional(),
  receivable: z.boolean().optional().default(true),
});

export type NewPartyT = z.infer<typeof PartyFormSchema>;
export type PartyT = z.infer<typeof PartySchema>;
