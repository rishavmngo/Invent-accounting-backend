import { Pool, PoolClient } from "pg";
import { z } from "zod";

export const BaseSchema = z.object({
  id: z.number().optional().nullable(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const zodDate = z.preprocess((arg) => {
  if (typeof arg === "string" || arg instanceof Date) {
    const parsed = new Date(arg);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return undefined;
}, z.date());

export type DbClient = PoolClient | Pool;
