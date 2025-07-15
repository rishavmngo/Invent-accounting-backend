import { ZodError } from "zod";
import { InvoiceGenT, ItemGenT } from "../features/invoice/invoice.schema";
import { format } from "date-fns";

export function prepareInsertParts<T extends object>(
  obj: T,
  exclude: (keyof T)[] = [],
) {
  const keys = Object.keys(obj).filter(
    (key) =>
      obj[key as keyof T] != undefined && !exclude.includes(key as keyof T),
  );

  const values = keys.map((key) => obj[key as keyof T]);

  const placeholder = keys.map((_, index) => `$${index + 1}`).join(",");
  return { keys, values, placeholder };
}

function formulaTotalAmount(item: ItemGenT): number {
  let quantity = 1;
  let price = 1;
  if (item.quantity) {
    quantity = item.quantity;
  }

  if (item.price_per_unit) {
    price = item.price_per_unit;
  }

  return quantity * price;
}

function calculateTotalAmount(items: ItemGenT[]) {
  let amt = 0;
  items.forEach((item) => {
    amt += formulaTotalAmount(item);
  });

  return amt;
}
export function formatZodError(error: ZodError) {
  return error.errors
    .map((e) => {
      const field = e.path.join(".");
      const message = e.message;
      return `${field}: ${message}`;
    })
    .join("; ");
}

export const transformationInvoiceData = (data: InvoiceGenT) => {
  return {
    ...data,
    customer_name: data.customer.name,
    customer_billing_address: data.customer.billing_address,
    customer_contact_number: data.customer.contact_number,
    formatted_date: format(
      data.created_at || new Date(),
      "dd MMM yyyy, h:mm a",
    ),
    total_amount: calculateTotalAmount(data.items),
    items: data.items.map((item, index) => ({
      ...item,
      order: `#${index + 1}`,
      price_per_unit: item.price_per_unit.toFixed(2),
      discount: (item.discount || 0).toFixed(2),
      tax: (item.tax || 0).toFixed(2),
      total: (item.price_per_unit * item.quantity).toFixed(2),
    })),
  };
};
