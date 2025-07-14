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

  async getById(ownerId: number, invoice_id: number, db: DbClient) {
    try {
      const query = `
SELECT 
  i.id,
  i.owner_id,
  u."name" AS owner_name,
  i.total_amount,
  p.id AS customer_id,
  p.name AS customer_name,
  p.billing_address AS billing_address,
  p.email_address AS customer_email_address,
  p.contact_number  AS customer_contact,
  ii.item_id,
  it.name AS item_name,
  ii.price_per_unit,
  ii.quantity,
  ii.discount,
  ii.tax,
  i.created_at
FROM invoice i 
LEFT JOIN invoice_item ii ON i.id = ii.invoice_id
LEFT JOIN party p  ON p.id = i.party_id
LEFT JOIN item it ON it.id = ii.item_id
LEFT JOIN users u ON u.id = i.owner_id
WHERE i.owner_id =$1 AND i.id = $2
ORDER BY i.id;
`;
      const res = await db.query(query, [ownerId, invoice_id]);
      return res.rows;
    } catch (error) {
      logger.error(error);
      throw new AppError("Db error while fetching invoice by id");
    }
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
  async getAll(ownerId: number, db: DbClient) {
    try {
      const query = `
SELECT 
  i.id,
  i.owner_id,
  u."name" AS owner_name,
  i.total_amount,
  p.id AS customer_id,
  p.name AS customer_name,
  p.billing_address AS billing_address,
  p.email_address AS customer_email_address,
  p.contact_number  AS customer_contact,
  ii.item_id,
  it.name AS item_name,
  ii.price_per_unit,
  ii.quantity,
  ii.discount,
  ii.tax,
  i.created_at
FROM invoice i 
LEFT JOIN invoice_item ii ON i.id = ii.invoice_id
LEFT JOIN party p  ON p.id = i.party_id
LEFT JOIN item it ON it.id = ii.item_id
LEFT JOIN users u ON u.id = i.owner_id
WHERE i.owner_id =$1 
ORDER BY i.id;
`;
      const res = await db.query(query, [ownerId]);
      return res.rows;
    } catch (error) {
      logger.error(error);
      throw new AppError("Db error while fetching all invoice by user");
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
