import { z } from "zod";
import { zodDate } from "../../shared/types";

export const StockInputSchema = z.object({
  item_id: z.number(),
  type: z.string(),
  quantity: z.number(),
  purchase_price: z.number().optional(),
  description: z.string().optional(),
  as_of_date: zodDate.optional(),
});

export type StockInput = z.infer<typeof StockInputSchema>;
