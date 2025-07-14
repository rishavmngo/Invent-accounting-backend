import { AppError } from "../../shared/appError.error";
import BaseService from "../../shared/base.service";
import logger from "../../shared/logger";
import { inventoryRepository } from "../inventory/inventory.repository";
import { Item } from "../inventory/inventory.schema";
import { InvoiceGenT } from "../invoice/invoice.schema";
import { partyRepository } from "../party/party.repository";
import { PartyT } from "../party/party.schema";
import { transactionRepository } from "./transaction.repository";
import {
  InvoiceDbT,
  InvoiceItemDbT,
  InvoiceWithoutIdT,
} from "./transaction.schema";

class TransactionService extends BaseService {
  async addSale(invoiceData: InvoiceWithoutIdT) {
    const db = this.db;

    try {
      await db.query("BEGIN");

      const party: PartyT = {
        id: invoiceData.data.customer_id,
        user_id: invoiceData.ownerId,
        name: invoiceData.data.customer_name as string,
        contact_number: invoiceData.data.contact_number,
      };

      const party_id = await partyRepository.getOrCreate(party, db);

      const invoice_table: InvoiceDbT = {
        party_id: party_id,
        owner_id: invoiceData.ownerId,
        contact_number: party.contact_number,
        total_amount: invoiceData.data.total_amount,
        paid_amount: invoiceData.data.paid_amount,
        full_paid: invoiceData.data.full_paid,
        due_date: invoiceData.data.due_date,
      };

      const invoice_id = await transactionRepository.addInvoice(
        invoice_table,
        db,
      );

      if (!invoice_id) {
        throw new AppError("failed to add invoice");
      }

      let items = invoiceData.items.map((item) => {
        const t: Item = {
          id: item.item_id,
          user_id: invoiceData.ownerId,
          name: item.item_name ? item.item_name : "",
          description: item.description,
          sale_price: item.price_per_unit,
        };
        return t;
      });

      items = await inventoryRepository.getOrCreateMany(
        items,
        invoiceData.ownerId,
        db,
      );

      const invoice_item = items.map((item, index) => {
        const t: InvoiceItemDbT = {
          invoice_id: invoice_id,

          item_id: item.id as number,
          quantity: invoiceData.items[index].quantity,
          price_per_unit: invoiceData.items[index].price_per_unit,
        };
        return t;
      });

      await transactionRepository.addInvoiceItem(invoice_item, db);

      await db.query("COMMIT");
    } catch (error) {
      logger.error(error);
      await db.query("ROLLBACK");
      throw error;
    }
  }

  async getById(ownerId: number, invoiceId: number) {
    try {
      const db = this.db;
      const data = await transactionRepository.getById(ownerId, invoiceId, db);

      const grouped = {} as Record<number, InvoiceGenT>;

      for (const row of data) {
        const invoice_id = row.id;
        if (!grouped[invoice_id]) {
          grouped[invoice_id] = {
            id: invoice_id,
            owner_id: row.owner_id,
            owner_name: row.owner_name,
            total_amount: row.total_amount,
            customer: {
              id: row.customer_id,
              name: row.customer_name,
              billing_address: row.billing_address,
              email_address: row.customer_email_address,
              contact_number: row.customer_contact,
            },
            created_at: row.created_at,
            items: [],
          };
        }

        grouped[invoice_id].items.push({
          item_id: row.item_id,
          name: row.item_name,
          price_per_unit: row.price_per_unit,
          quantity: row.quantity,
          discount: row.discount,
          tax: row.tax,
        });
      }
      return grouped[data[0].id];
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async getAll(ownerId: number) {
    try {
      const db = this.db;
      const data = await transactionRepository.getAll(ownerId, db);

      const grouped = {} as Record<number, InvoiceGenT>;

      for (const row of data) {
        const invoice_id = row.id;
        if (!grouped[invoice_id]) {
          grouped[invoice_id] = {
            id: invoice_id,
            owner_id: row.owner_id,
            owner_name: row.owner_name,
            total_amount: row.total_amount,
            customer: {
              id: row.customer_id,
              name: row.customer_name,
              billing_address: row.billing_address,
              email_address: row.customer_email_address,
              contact_number: row.customer_contact,
            },
            created_at: row.created_at,
            items: [],
          };
        }

        grouped[invoice_id].items.push({
          item_id: row.item_id,
          name: row.item_name,
          price_per_unit: row.price_per_unit,
          quantity: row.quantity,
          discount: row.discount,
          tax: row.tax,
        });
      }
      return grouped;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

export const transactionService = new TransactionService();
