import { z } from "zod";

export const CustomerSchema = z.object({
  id: z.number(),
  name: z.string(),
  billing_address: z.string().nullable(),
  email_address: z.string().email(),
  contact_number: z.string().nullable(),
});

export const ItemSchema = z.object({
  item_id: z.number(),
  name: z.string(),
  price_per_unit: z.number(),
  quantity: z.number(),
  discount: z.number().nullable(),
  tax: z.number().nullable(),
});

export type ItemGenT = z.infer<typeof ItemSchema>;

export const InvoiceSchema = z.object({
  id: z.number(),
  owner_id: z.number(),
  owner_name: z.string(),
  total_amount: z.number(),
  customer: CustomerSchema,
  created_at: z.coerce.date().nullable(),
  items: z.array(ItemSchema),
});

export type InvoiceGenT = z.infer<typeof InvoiceSchema>;
