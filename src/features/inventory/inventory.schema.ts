import { z } from "zod";
import { BaseSchema, zodDate } from "../../shared/types";

export const ItemInputSchema = z.object({
  user_id: z.number(),
  name: z.string(),
  code: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  hsn_code: z.string().optional(),
  sale_price: z.number().optional(),
  purchase_price: z.number().optional(),
  discount: z.number().optional(),
  tax_rate: z.string().optional(),
  min_stock_qty: z.number().optional(),
  location: z.string().optional(),
});
export type ItemInput = z.infer<typeof ItemInputSchema>;

export const ItemSchema = BaseSchema.merge(ItemInputSchema);

export type Item = z.infer<typeof ItemSchema>;

export const ItemFormSchema = ItemInputSchema.extend({
  opening_stock: z.number().optional(),
  as_of_date: zodDate.optional(),
  price_per_unit: z.number().optional(),
});

export type ItemForm = z.infer<typeof ItemFormSchema>;
