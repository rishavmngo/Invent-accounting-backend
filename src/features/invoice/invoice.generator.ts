import { format } from "date-fns";
import mustache from "mustache";
import { InvoiceGenT, ItemGenT } from "./invoice.schema";
import { transformationInvoiceData } from "../../shared/helper";

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

export const bodyTemplate1 = `
<div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
  <!-- Header with gradient background -->
  <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
    <div class="flex justify-between items-start">
      <div class="space-y-2">
        <h2 class="text-2xl font-bold">{{owner_name}}</h2>
        <div class="space-y-1 text-blue-100">
          <p class="flex items-center gap-2 text-sm">
            <i data-feather="map-pin" class="w-4 h-4"></i> 
            Gm building, Greater patna
          </p>
          <p class="flex items-center gap-2 text-sm">
            <i data-feather="phone" class="w-4 h-4"></i>
            +91 xxxxxxx
          </p>
          <p class="flex items-center gap-2 text-sm">
            <i data-feather="globe" class="w-4 h-4"></i>
            example.com
          </p>
        </div>
      </div>
      <div class="text-right">
        <div class="bg-white text-blue-800 px-6 py-3 rounded-lg shadow-md">
          <h1 class="text-3xl font-bold">INVOICE</h1>
          <p class="text-sm mt-1 text-blue-600">{{formatted_date}}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Content area -->
  <div class="p-8">
    <!-- Customer Section -->
    <div class="mb-8">
      <div class="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-600">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <i data-feather="user" class="w-5 h-5 text-blue-600"></i>
          Bill To
        </h3>
        <div class="space-y-2 text-gray-700">
          <p class="font-medium text-lg">{{customer_name}}</p>
          <p class="text-sm">{{customer_billing_address}}</p>
          <p class="text-sm flex items-center gap-2">
            <i data-feather="phone" class="w-4 h-4 text-gray-500"></i> 
            {{customer_contact_number}}
          </p>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <div class="mb-8 overflow-hidden rounded-lg border border-gray-200">
      <table class="w-full">
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="px-4 py-3 text-left font-medium">#</th>
            <th class="px-4 py-3 text-left font-medium">Description</th>
            <th class="px-4 py-3 text-left font-medium">Qty</th>
            <th class="px-4 py-3 text-left font-medium">Rate</th>
            <th class="px-4 py-3 text-left font-medium">Discount</th>
            <th class="px-4 py-3 text-left font-medium">GST</th>
            <th class="px-4 py-3 text-left font-medium">Amount</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {{#items}}
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-900">{{order}}</td>
            <td class="px-4 py-3 text-sm text-gray-900 font-medium">{{name}}</td>
            <td class="px-4 py-3 text-sm text-gray-900">{{quantity}}</td>
            <td class="px-4 py-3 text-sm text-gray-900">₹{{price_per_unit}}</td>
            <td class="px-4 py-3 text-sm text-gray-900">₹{{discount}}</td>
            <td class="px-4 py-3 text-sm text-gray-900">₹{{tax}}</td>
            <td class="px-4 py-3 text-sm text-gray-900 font-semibold">₹{{total}}</td>
          </tr>
          {{/items}}
        </tbody>
      </table>
    </div>

    <!-- Comments + Total -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Comments Section -->
      <div class="space-y-3">
        <h4 class="font-semibold text-gray-800 flex items-center gap-2">
          <i data-feather="message-circle" class="w-4 h-4 text-blue-600"></i>
          Comments & Instructions
        </h4>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-24 bg-gray-50">
          <p class="text-sm text-gray-500 italic">Add any special instructions or comments here...</p>
        </div>
      </div>

      <!-- Total Section -->
      <div class="space-y-3">
        <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div class="space-y-3">
            <div class="bg-blue-600 text-white rounded-lg p-4 flex justify-between items-center">
              <span class="text-lg font-semibold">Total Amount</span>
              <span class="text-2xl font-bold">₹{{total_amount}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-8 pt-6 border-t border-gray-200">
      <p class="text-center text-sm text-gray-500">
        Thank you for your business! • Questions? Contact us at example.com
      </p>
    </div>
  </div>
</div>
`;

export const bodyTemplate = `
    <div class="max-w-4xl mx-auto border border-gray-300 p-8 shadow-md">
      <!-- Header -->
      <div class="flex justify-between items-start mb-8">
        <div class="">
          <h2 class="text-xl font-medium mb-2">{{owner_name}}</h2>
          <p class="text-sm flex gap-2"><i data-feather="home" class="w-4 h-4 text-gray-500"></i> Gm building, Greater patna</p>
          <p class="text-sm flex gap-2"><i data-feather="phone" class="w-4 h-4 text-gray-500"></i>+91 xxxxxxx</p>
          <p class="text-sm flex gap-2"><i data-feather="link" class="w-4 h-4 text-gray-500"></i>example.com</p>
        </div>
        <div class="text-right">
          <h1 class="text-3xl font-bold text-red-600 uppercase">Sale</h1>
          <p class="text-sm mt-2">Date: {{formatted_date}}</p>
          <!-- <p class="text-sm">PO #:"N/A"</p> -->
        </div>
      </div>

      <!-- Customer Section -->
      <div class="grid grid-cols-2 gap-4 border-t border-b border-gray-300 py-4 mb-6">
        <div>
          <h3 class="bg-red-600 text-white px-3 py-1 text-sm font-semibold inline-block mb-2">CUSTOMER</h3>
          <p class="text-sm font-medium">{{customer_name}}</p>
          <p class="text-sm">{{customer_billing_address}}</p>
          <p class="text-sm flex items-center gap-2">
            <i data-feather="phone" class="w-4 h-4 text-gray-500"></i> {{customer_contact_number}}
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
    {{#items}}
    <tr>
      <td class="border border-gray-300 px-3 py-2">{{order}}</td>
      <td class="border border-gray-300 px-3 py-2">{{name}}</td>
      <td class="border border-gray-300 px-3 py-2">{{quantity}}</td>
      <td class="border border-gray-300 px-3 py-2">₹{{price_per_unit}}</td>
      <td class="border border-gray-300 px-3 py-2">₹{{discount}}</td>
      <td class="border border-gray-300 px-3 py-2">₹{{tax}}</td>
      <td class="border border-gray-300 px-3 py-2">₹{{total}}</td>
    </tr>
    {{/items}}
  </tbody>
</table>

      <!-- Comments + Total -->
      <div class="flex justify-between">
        <div class="w-1/2">
          <p class="bg-gray-200 px-3 py-1 font-semibold text-sm mb-1">Comments or Special Instructions</p>
          <div class="border border-gray-300 p-3 h-24 whitespace-pre-wrap text-sm">
            
          </div>
        </div>
        <div class="w-1/3 text-sm">
<!--
          <div class="flex justify-between border-b border-gray-300 py-1">
            <span>Subtotal:</span>
            <span>₹500</span>
          </div>
          <div class="flex justify-between border-b border-gray-300 py-1">
            <span>Tax:</span>
            <span>₹{{tax}}</span>
          </div>
-->
          <div class="flex justify-between bg-red-600 text-white font-semibold py-2 px-2 mt-2">
            <span>Total:</span>
            <span>₹{{total_amount}}</span>
          </div>
        </div>
      </div>
    </div>
`;

export const generateInvoice = (
  data: InvoiceGenT,
  template: string,
): string => {
  const formattedData = transformationInvoiceData(data);

  const bodyHTML = mustache.render(template, formattedData);

  return `
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Invoice</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/feather-icons"></script>
  </head>
  <body class="p-10 font-sans text-gray-800">
   ${bodyHTML}
    <script>
      feather.replace();
    </script>
  </body>
</html>
  `;
};

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
          <p class="text-md font-medium">${data.customer.name}</p>
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
