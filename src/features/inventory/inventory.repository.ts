import { AppError } from "../../shared/appError.error";
import BaseRepository from "../../shared/base.repository";
import { ErrorCode } from "../../shared/errorCode";
import { prepareInsertParts } from "../../shared/helper";
import logger from "../../shared/logger";
import { DbClient } from "../../shared/types";
import { ItemInput } from "./inventory.schema";

class InventoryRepository extends BaseRepository {
  constructor() {
    super("item");
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
WHERE item_id = $1 
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
