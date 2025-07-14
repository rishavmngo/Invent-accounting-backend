import { AppError } from "../../shared/appError.error";
import BaseRepository from "../../shared/base.repository";
import { ErrorCode } from "../../shared/errorCode";
import { prepareInsertParts } from "../../shared/helper";
import logger from "../../shared/logger";
import { DbClient } from "../../shared/types";
import { InvoiceDbT, InvoiceItemDbT } from "./transaction.schema";

class TransactionRepository extends BaseRepository {
  constructor() {
    super("invoice");
  }

  async addInvoice(invoice: InvoiceDbT, db: DbClient) {
    try {
      const res = prepareInsertParts(invoice);

      const query = `INSERT INTO invoice(${res.keys.join(",")}) VALUES(${res.placeholder}) returning id`;

      const { rows } = await db.query(query, res.values);

      if (rows.length < 1) {
        throw new AppError(
          "Adding party failed!",
          400,
          ErrorCode.PARTY_ADD_FAILED,
        );
      }
      return rows[0].id;
    } catch (error) {
      logger.error(error);
      throw new AppError(
        "Error occur while adding invoice",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }

  async addInvoiceItem(items: InvoiceItemDbT[], db: DbClient) {
    try {
      // const result = []
      for (const item of items) {
        if (item.item_id) {
          const res = prepareInsertParts(item);

          const query = `INSERT INTO invoice_item(${res.keys.join(",")}) VALUES(${res.placeholder}) returning id`;

          const { rows } = await db.query(query, res.values);

          if (rows.length < 1) {
            throw new AppError(
              "Adding party failed!",
              400,
              ErrorCode.PARTY_ADD_FAILED,
            );
          }
        }
      }
    } catch (error) {
      logger.error(error);
      throw new AppError(
        "Error occur while adding invoice items",
        400,
        ErrorCode.UNEXPECTED_ERROR,
      );
    }
  }
}

export const transactionRepository = new TransactionRepository();
