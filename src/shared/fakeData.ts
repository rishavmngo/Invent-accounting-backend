import { InvoiceGenT } from "../features/invoice/invoice.schema";

export const data: InvoiceGenT = {
  id: 2,
  owner_id: 4,
  owner_name: "Rishav raj",
  total_amount: 8100,
  customer: {
    id: 3,
    name: "Tata steel",
    billing_address: "",
    email_address: "something@gmail.com",
    contact_number: "",
  },
  created_at: new Date("2025-07-14T12:49:03.854Z"),
  items: [
    {
      item_id: 4,
      name: "oggy",
      price_per_unit: 100,
      quantity: 1,
      discount: null,
      tax: null,
    },
    {
      item_id: 5,
      name: "Item_three",
      price_per_unit: 2000,
      quantity: 4,
      discount: null,
      tax: null,
    },
  ],
};
