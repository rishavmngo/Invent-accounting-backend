import { InvoiceGenT } from "../features/invoice/invoice.schema";

export const data: InvoiceGenT = {
  id: 2,
  owner_id: 4,
  owner_name: "xyz company",
  total_amount: 8100,
  customer: {
    id: 3,
    name: "abc electrnoics",
    billing_address: "Sephant tower Hauz Khas, New Delhi, Delhi 110016",
    email_address: "something@invent.com",
    contact_number: "",
  },
  created_at: new Date("2025-07-14T12:49:03.854Z"),
  items: [
    {
      item_id: 4,
      name: "Item abc",
      price_per_unit: 100,
      quantity: 1,
      discount: null,
      tax: null,
    },
    {
      item_id: 5,
      name: "Item xyz",
      price_per_unit: 2000,
      quantity: 4,
      discount: null,
      tax: null,
    },
  ],
};
