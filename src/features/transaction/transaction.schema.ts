import { nullable, z } from "zod";

const dataSchema = z.object({
  customer_name: z.string().optional(),
  customer_id: z.number().nullable(),
  contact_number: z.string().optional(),
  total_amount: z.number(),
  paid_amount: z.number().nullable(),
  full_paid: z.boolean(),
  due_date: z.coerce.date().nullable(), // or z.date().nullable() if it's JS Date
});
const itemSchema = z.object({
  item_name: z.string().optional(),
  item_id: z.number().nullable(),
  quantity: z.number(),
  description: z.string().optional(),
  price_per_unit: z.number().optional(),
});

const InvoiceSchema = z.object({
  id: z.number(),
  data: dataSchema,
  items: z.array(itemSchema),
  ownerId: z.number(),
});

export type InvoiceT = z.infer<typeof InvoiceSchema>;

export const InvoiceSchemaWithoutId = InvoiceSchema.omit({
  id: true,
});

export type InvoiceWithoutIdT = z.infer<typeof InvoiceSchemaWithoutId>;

export const InvoiceDbSchema = z.object({
  id: z.number().optional(),
  party_id: z.number(),
  contact_number: z.string().optional(),
  total_amount: z.number().nullable(),
  paid_amount: z.number().nullable(),
  full_paid: z.boolean().nullable(),
  due_date: z.coerce.date().nullable(),
  created_at: z.coerce.date().optional().nullable(),
  updated_at: z.coerce.date().optional().nullable(),
});

export type InvoiceDbT = z.infer<typeof InvoiceDbSchema>;

export const InvoiceItemDbSchema = z.object({
  id: z.number().optional(), // NOT NULL
  item_id: z.number(),
  invoice_id: z.number(),
  quantity: z.number().optional().nullable(),
  price_per_unit: z.number().optional(),
  discount: z.number().optional().nullable(),
  tax: z.number().optional().nullable(),
  created_at: z.coerce.date().optional().nullable(),
  updated_at: z.coerce.date().optional().nullable(),
});

export type InvoiceItemDbT = z.infer<typeof InvoiceItemDbSchema>;
