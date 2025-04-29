import { AppError } from "../../shared/appError.error";
import BaseRepository from "../../shared/base.repository";
import { ErrorCode } from "../../shared/errorCode";
import { prepareInsertParts } from "../../shared/helper";
import logger from "../../shared/logger";
import { DbClient } from "../../shared/types";
import { StockInput } from "./stock.schema";

class StockRepository extends BaseRepository {
  constructor() {
    super("item_stock");
  }

  async insert(stock: StockInput, db: DbClient) {
    const res = prepareInsertParts(stock);

    const query = `INSERT INTO item_stock(${res.keys.join(",")}) VALUES(${res.placeholder}) returning id`;

    try {
      const { rows } = await db.query(query, res.values);

      if (rows.length < 1) {
        throw new AppError(
          "Failed to insert stock entry into db",
          400,
          ErrorCode.UNEXPECTED_ERROR,
        );
      }

      return rows[0].id;
    } catch (error) {
      logger.error(error);

      throw new AppError(
        "Failed to insert stock entry",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }
}

export const stockRepository = new StockRepository();
