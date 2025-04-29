import { AppError } from "../../shared/appError.error";
import BaseRepository from "../../shared/base.repository";
import { ErrorCode } from "../../shared/errorCode";
import { prepareInsertParts } from "../../shared/helper";
import logger from "../../shared/logger";
import { DbClient } from "../../shared/types";
import { ItemInput } from "./inventory.schema";

class InventoryRepository extends BaseRepository {
  constructor() {
    super("party");
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
}

export const inventoryRepository = new InventoryRepository();
