import { z } from "zod";
import { BaseSchema, zodDate } from "../../shared/types";

export const ItemInputSchema = z.object({
  user_id: z.number(),
  name: z.string(),
  code: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  hsn_code: z.string().optional(),
  sale_price: z.number().optional().nullable(),
  purchase_price: z.number().optional().nullable(),
  discount: z.number().optional().nullable(),
  tax_rate: z.string().optional().nullable(),
  min_stock_qty: z.number().optional().nullable(),
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

export const ItemStockSchemaBase = z.object({
  id: z.number(),
  type: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  as_of_date: z.coerce.date().optional(),
});

export const ItemStockSchema = ItemStockSchemaBase.extend({
  item_id: z.number(),
  quantity: z.number(),
  purchase_price: z.number().optional(),
});

export const ItemStockAddSchema = ItemStockSchema.omit({ id: true });

export type ItemStockAddT = z.infer<typeof ItemStockAddSchema>;
export type ItemStock = z.infer<typeof ItemStockSchema>;
