import { AppError } from "../../shared/appError.error";
import BaseRepository from "../../shared/base.repository";
import { ErrorCode } from "../../shared/errorCode";
import { prepareInsertParts } from "../../shared/helper";
import logger from "../../shared/logger";
import { DbClient } from "../../shared/types";
import { ItemInput, ItemStockAddT } from "./inventory.schema";

class InventoryRepository extends BaseRepository {
  constructor() {
    super("item");
  }

  async deleteStock(itemStockId: number, itemId: number, db: DbClient) {
    try {
      // TODO: Add a field to hide instead of delete for better bookeeping
      const query = `DELETE from item_stock WHERE id=$1 AND item_id=$2`;

      await db.query(query, [itemStockId, itemId]);
    } catch (error) {
      logger.error(error);
      throw new AppError(
        "Error occured in DB while deleting a item's stock",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }
  async adjustStock(stock: ItemStockAddT, db: DbClient) {
    try {
      const { keys, values, placeholder } = prepareInsertParts(stock);

      const query = `INSERT INTO item_stock(${keys}) VALUES(${placeholder}) returning id`;
      await db.query(query, values);
    } catch (error) {
      logger.error(error);
      throw new AppError(
        "Error occured in DB while adjusting stock in item_stock table",
      );
    }
  }

  async getAllStocks(itemId: number, db: DbClient) {
    try {
      const query = `SELECT * FROM item_stock where item_id=$1 ORDER BY as_of_date ASC`;
      console.log(query, itemId);

      const res = await db.query(query, [itemId]);

      return res.rows;
    } catch (error) {
      logger.error(error);

      throw new AppError(
        "Error occured in DB while fetching all stocks of Item!",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }

  async getTotalQuantityById(itemId: number, db: DbClient) {
    try {
      const query = `SELECT
	item_id,
	SUM(CASE 
			WHEN type IN('add','opening_stock') THEN quantity
			WHEN type = 'reduce' THEN -quantity
			ELSE 0
			END) AS current_quantity
FROM 
item_stock
WHERE item_id=$1 
GROUP BY 
item_id;`;
      const res = await db.query(query, [itemId]);

      if (res.rows.length < 1) {
        return 0;
      }
      return res.rows[0].current_quantity;
    } catch (error) {
      logger.error(error);

      throw new AppError(
        "Error occured in DB while fetching  inventory by Id!",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }

  async getById(userId: number, itemId: number, db: DbClient) {
    try {
      const query = `SELECT * FROM item WHERE user_id=$1 AND id=$2`;

      const res = await db.query(query, [userId, itemId]);

      if (res.rows.length < 1) {
        throw new AppError(
          "Can't able to find the item",
          400,
          ErrorCode.NOT_FOUND,
        );
      }

      return res.rows[0];
    } catch (error) {
      logger.error(error);

      throw new AppError(
        "Error occured in DB while fetching  inventory by Id!",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }

  prepareUpdateParts<T extends object>(obj: T, exclude: (keyof T)[] = []) {
    const keys = Object.keys(obj).filter(
      (key) => !exclude.includes(key as keyof T),
    );

    const values = keys.map((key) => obj[key as keyof T]);

    const placeholder = keys
      .map((key, index) => `${key}=$${index + 2}`)
      .join(",");
    return { keys, values, placeholder };
  }
  async update(id: number, item: ItemInput, db: DbClient) {
    const { keys, values, placeholder } = this.prepareUpdateParts(item, [
      "user_id",
    ]);
    try {
      const query = `UPDATE item 
                      set ${placeholder} 
                      where id=$1
`;
      console.log(query);
      console.log(keys, values, placeholder);
      await db.query(query, [id, ...values]);
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async insert(item: ItemInput, db: DbClient) {
    try {
      const res = prepareInsertParts(item);

      const query = `INSERT INTO item(${res.keys.join(",")}) VALUES(${res.placeholder}) returning id`;
      const { rows } = await db.query(query, res.values);
      if (rows.length < 1) {
        throw new AppError(
          "Adding item failed!",
          400,
          ErrorCode.PARTY_ADD_FAILED,
        );
      }

      const id = rows[0].id;
      return id;
    } catch (error) {
      logger.error(error);

      throw new AppError(
        "Error occured in DB while adding a item",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }

  async delete(itemId: number, db: DbClient) {
    try {
      // TODO: Add a field to hide instead of delete for better bookeeping
      const query = `DELETE from item WHERE id=$1`;

      await db.query(query, [itemId]);
    } catch (error) {
      logger.error(error);
      throw new AppError(
        "Error occured in DB while adding a item",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }

  async findAllCardData(userId: number, db: DbClient) {
    try {
      const query = `SELECT * FROM ${this.table} WHERE user_id=$1`;

      const { rows } = await db.query(query, [userId]);

      return rows;
    } catch (error) {
      logger.error(error);
      throw new AppError(
        "Failed to fetch All items of a user from inventory",
        400,
        ErrorCode.CONFLICT_ERROR,
      );
    }
  }
}

export const inventoryRepository = new InventoryRepository();
