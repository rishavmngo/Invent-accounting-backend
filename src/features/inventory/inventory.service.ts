import BaseService from "../../shared/base.service";
import logger from "../../shared/logger";
import { stockRepository } from "../stock/stock.repository";
import { StockInput } from "../stock/stock.schema";
import { inventoryRepository } from "./inventory.repository";
import { ItemForm, ItemInputSchema } from "./inventory.schema";

class InventoryService extends BaseService {
  async add(newItemForm: ItemForm) {
    const newItem = ItemInputSchema.parse(newItemForm);
    const stock = { ...newItemForm };

    for (const key of Object.keys(newItem) as (keyof typeof newItem)[]) {
      delete stock[key];
    }
    const db = await this.db.connect();

    try {
      db.query("BEGIN");
      const item_id = await inventoryRepository.insert(newItem, db);

      if (stock["opening_stock"]) {
        const stockEntry: StockInput = {
          item_id: item_id,
          type: "opening_stock",
          quantity: stock.opening_stock,
          purchase_price: stock.price_per_unit,
          as_of_date: stock.as_of_date,
        };

        await stockRepository.insert(stockEntry, db);
      }
      await db.query("COMMIT");
    } catch (error) {
      logger.error(error);
      await db.query("ROLLBACK");

      throw error;
    }
  }
}

export const inventoryService = new InventoryService();
