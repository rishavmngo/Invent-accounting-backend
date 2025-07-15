import { format } from "date-fns";
import { InvoiceGenT, ItemGenT } from "./invoice.schema";

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
export const generateInvoiceHTML = (data: InvoiceGenT): string => {
  return `
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Invoice</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/feather-icons"></script>
  </head>
  <body class="p-10 font-sans text-gray-800">
    <div class="max-w-4xl mx-auto border border-gray-300 p-8 shadow-md">
      <!-- Header -->
      <div class="flex justify-between items-start mb-8">
        <div class="">
          <h2 class="text-xl font-medium mb-2">${data.owner_name}</h2>
          <p class="text-sm flex gap-2"><i data-feather="home" class="w-4 h-4 text-gray-500"></i> Gm building, Greater patna</p>
          <p class="text-sm flex gap-2"><i data-feather="phone" class="w-4 h-4 text-gray-500"></i> +91 xxxxxxx</p>
          <p class="text-sm flex gap-2"><i data-feather="link" class="w-4 h-4 text-gray-500"></i> ${"www.google.com"}</p>
        </div>
        <div class="text-right">
          <h1 class="text-3xl font-bold text-red-600 uppercase">Sale</h1>
          <p class="text-sm mt-2">Date: ${format(data.created_at || new Date(), "dd MMM yyyy, h:mm a")}</p>
          <!-- <p class="text-sm">PO #: ${data || "N/A"}</p> -->
        </div>
      </div>

      <!-- Customer Section -->
      <div class="grid grid-cols-2 gap-4 border-t border-b border-gray-300 py-4 mb-6">
        <div>
          <h3 class="bg-red-600 text-white px-3 py-1 text-sm font-semibold inline-block mb-2">CUSTOMER</h3>
          <p class="text-sm font-medium">${data.customer.name}</p>
          <p class="text-sm">${data.customer.billing_address}</p>
          <p class="text-sm flex items-center gap-2">
            <i data-feather="phone" class="w-4 h-4 text-gray-500"></i> ${data.customer.contact_number}
          </p>
        </div>
      </div>

      <!-- Items Table -->
      <table class="w-full border-collapse text-sm mb-6">
        <thead>
          <tr class="bg-red-600 text-white">
            <th class="border border-gray-300 px-3 py-2 text-left">Item #</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Description</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Qty</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Price/ unit</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Discount</th>
            <th class="border border-gray-300 px-3 py-2 text-left">GST</th>
            <th class="border border-gray-300 px-3 py-2 text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          ${data.items
            .map(
              (item, index: number) => `
              <tr>
                <td class="border border-gray-300 px-3 py-2">${index + 1}</td>
                <td class="border border-gray-300 px-3 py-2">${item.name}</td>
                <td class="border border-gray-300 px-3 py-2">${item.quantity}</td>
                <td class="border border-gray-300 px-3 py-2">₹${item.price_per_unit.toFixed(2)}</td>
                <td class="border border-gray-300 px-3 py-2">₹${(item.discount || 0).toFixed(2)}</td>
                <td class="border border-gray-300 px-3 py-2">₹${(item.tax || 0).toFixed(2)}</td>
                <td class="border border-gray-300 px-3 py-2">₹${(item.price_per_unit * item.quantity).toFixed(2)}</td>
              </tr>
            `,
            )
            .join("")}
        </tbody>
      </table>

      <!-- Comments + Total -->
      <div class="flex justify-between">
        <div class="w-1/2">
          <p class="bg-gray-200 px-3 py-1 font-semibold text-sm mb-1">Comments or Special Instructions</p>
          <div class="border border-gray-300 p-3 h-24 whitespace-pre-wrap text-sm">
            ${""}
          </div>
        </div>
        <div class="w-1/3 text-sm">
<!--
          <div class="flex justify-between border-b border-gray-300 py-1">
            <span>Subtotal:</span>
            <span>₹${500}</span>
          </div>
          <div class="flex justify-between border-b border-gray-300 py-1">
            <span>Tax:</span>
            <span>₹${"18%"}</span>
          </div>
-->
          <div class="flex justify-between bg-red-600 text-white font-semibold py-2 px-2 mt-2">
            <span>Total:</span>
            <span>₹${calculateTotalAmount(data.items)}</span>
          </div>
        </div>
      </div>
    </div>

    <script>
      feather.replace();
    </script>
  </body>
</html>
  `;
};
