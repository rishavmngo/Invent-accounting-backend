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

export const bodyTemplate3 = `
<div class="max-w-4xl mx-auto bg-gray-900 text-white shadow-2xl border border-gray-700">
  <!-- Header Section -->
  <div class="relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
    <div class="relative p-8">
      <div class="flex justify-between items-start mb-6">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
            <h2 class="text-2xl font-bold text-white">{{owner_name}}</h2>
          </div>
          <div class="space-y-2 text-gray-300 ml-6">
            <p class="flex items-center gap-3 text-sm">
              <i data-feather="map-pin" class="w-4 h-4 text-purple-400"></i>
              Gm building, Greater patna
            </p>
            <p class="flex items-center gap-3 text-sm">
              <i data-feather="phone" class="w-4 h-4 text-purple-400"></i>
              +91 xxxxxxx
            </p>
            <p class="flex items-center gap-3 text-sm">
              <i data-feather="link" class="w-4 h-4 text-purple-400"></i>
              example.com
            </p>
          </div>
        </div>
        <div class="text-right">
          <div class="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-lg shadow-lg">
            <h1 class="text-3xl font-bold text-white tracking-wide">INVOICE</h1>
            <div class="mt-2 flex items-center justify-end gap-2">
              <i data-feather="calendar" class="w-4 h-4 text-purple-200"></i>
              <p class="text-sm text-purple-100">{{formatted_date}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="px-8 pb-8">
    <!-- Customer Section -->
    <div class="mb-8">
      <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <i data-feather="user" class="w-4 h-4 text-white"></i>
          </div>
          <h3 class="text-lg font-semibold text-white">Bill To</h3>
        </div>
        <div class="space-y-2 text-gray-300">
          <p class="text-xl font-medium text-white">{{customer_name}}</p>
          <p class="text-gray-400">{{customer_billing_address}}</p>
          <p class="flex items-center gap-2 text-gray-400">
            <i data-feather="phone" class="w-4 h-4 text-purple-400"></i> 
            {{customer_contact_number}}
          </p>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <div class="mb-8">
      <div class="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <table class="w-full">
          <thead class="bg-gradient-to-r from-purple-600 to-blue-600">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-semibold text-white">#</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-white">Item Description</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-white">Qty</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-white">Unit Price</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-white">Discount</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-white">GST</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-white">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            {{#items}}
            <tr class="hover:bg-gray-750 transition-colors">
              <td class="px-6 py-4 text-sm text-gray-300">{{order}}</td>
              <td class="px-6 py-4 text-sm text-white font-medium">{{name}}</td>
              <td class="px-6 py-4 text-sm text-gray-300">{{quantity}}</td>
              <td class="px-6 py-4 text-sm text-gray-300">₹{{price_per_unit}}</td>
              <td class="px-6 py-4 text-sm text-gray-300">₹{{discount}}</td>
              <td class="px-6 py-4 text-sm text-gray-300">₹{{tax}}</td>
              <td class="px-6 py-4 text-sm text-white font-semibold text-right">₹{{total}}</td>
            </tr>
            {{/items}}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Comments + Total -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Comments Section -->
      <div>
        <div class="flex items-center gap-2 mb-4">
          <i data-feather="message-square" class="w-5 h-5 text-purple-400"></i>
          <h4 class="text-lg font-semibold text-white">Notes & Instructions</h4>
        </div>
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-4 min-h-24">
          <p class="text-sm text-gray-500 italic">Add special instructions or comments here...</p>
        </div>
      </div>

      <!-- Total Section -->
      <div>
        <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 shadow-lg">
          <div class="text-center">
            <div class="flex items-center justify-center gap-2 mb-2">
              <i data-feather="credit-card" class="w-5 h-5 text-purple-200"></i>
              <p class="text-sm font-medium text-purple-100 uppercase tracking-wider">Grand Total</p>
            </div>
            <p class="text-4xl font-bold text-white">₹{{total_amount}}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-12 pt-8 border-t border-gray-700">
      <div class="text-center">
        <div class="flex items-center justify-center gap-4 mb-4">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            <p class="text-sm text-gray-400">Secure</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p class="text-sm text-gray-400">Professional</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
            <p class="text-sm text-gray-400">Trusted</p>
          </div>
        </div>
        <p class="text-sm text-gray-500">Thank you for your business partnership</p>
      </div>
    </div>
  </div>
</div>
`;

export const bodyTemplate2 = `
<div class="max-w-4xl mx-auto bg-white shadow-2xl border-t-8 border-emerald-500">
  <!-- Header Section -->
  <div class="p-8 bg-gradient-to-br from-gray-50 to-white">
    <div class="flex justify-between items-start mb-8">
      <div class="space-y-4">
        <div class="border-l-4 border-emerald-500 pl-4">
          <h2 class="text-3xl font-light text-gray-800">{{owner_name}}</h2>
        </div>
        <div class="space-y-2 text-gray-600 ml-4">
          <p class="flex items-center gap-3 text-sm">
            <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Gm building, Greater patna
          </p>
          <p class="flex items-center gap-3 text-sm">
            <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
            +91 xxxxxxx
          </p>
          <p class="flex items-center gap-3 text-sm">
            <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
            example.com
          </p>
        </div>
      </div>
      <div class="text-right space-y-2">
        <h1 class="text-5xl font-thin text-emerald-600 tracking-wide">INVOICE</h1>
        <div class="bg-emerald-50 px-4 py-2 rounded-md border border-emerald-200">
          <p class="text-sm text-emerald-700 font-medium">{{formatted_date}}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="px-8 pb-8">
    <!-- Customer Section -->
    <div class="mb-8">
      <div class="relative">
        <div class="absolute -left-2 top-0 w-1 h-full bg-emerald-500 rounded-full"></div>
        <div class="pl-6">
          <h3 class="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3">Invoice To</h3>
          <div class="space-y-1">
            <p class="text-xl font-medium text-gray-800">{{customer_name}}</p>
            <p class="text-gray-600">{{customer_billing_address}}</p>
            <p class="text-gray-600 flex items-center gap-2">
              <i data-feather="phone" class="w-4 h-4 text-emerald-500"></i> 
              {{customer_contact_number}}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <div class="mb-8">
      <div class="overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="border-b-2 border-emerald-500">
              <th class="px-0 py-4 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">Item</th>
              <th class="px-4 py-4 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">Description</th>
              <th class="px-4 py-4 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">Qty</th>
              <th class="px-4 py-4 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">Rate</th>
              <th class="px-4 py-4 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">Discount</th>
              <th class="px-4 py-4 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">GST</th>
              <th class="px-4 py-4 text-right text-xs uppercase tracking-wider text-gray-500 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            {{#items}}
            <tr class="hover:bg-emerald-50 transition-colors">
              <td class="px-0 py-4 text-sm text-gray-900">{{order}}</td>
              <td class="px-4 py-4 text-sm text-gray-900 font-medium">{{name}}</td>
              <td class="px-4 py-4 text-sm text-gray-700">{{quantity}}</td>
              <td class="px-4 py-4 text-sm text-gray-700">₹{{price_per_unit}}</td>
              <td class="px-4 py-4 text-sm text-gray-700">₹{{discount}}</td>
              <td class="px-4 py-4 text-sm text-gray-700">₹{{tax}}</td>
              <td class="px-4 py-4 text-sm text-gray-900 font-semibold text-right">₹{{total}}</td>
            </tr>
            {{/items}}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Comments + Total -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Comments Section -->
      <div class="lg:col-span-2">
        <h4 class="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3">Additional Notes</h4>
        <div class="border border-gray-200 rounded-lg p-4 min-h-24 bg-gray-50">
          <p class="text-sm text-gray-400 italic">Special instructions or comments...</p>
        </div>
      </div>

      <!-- Total Section -->
      <div class="space-y-4">
        <div class="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
          <div class="text-center">
            <p class="text-xs uppercase tracking-widest text-emerald-600 font-semibold mb-2">Total Amount</p>
            <p class="text-3xl font-light text-emerald-700">₹{{total_amount}}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-12 pt-8 border-t border-gray-200">
      <div class="text-center">
        <p class="text-sm text-gray-500">Thank you for choosing our services</p>
        <div class="mt-2 flex justify-center items-center gap-2">
          <span class="w-8 h-0.5 bg-emerald-500"></span>
          <span class="text-xs text-emerald-600 font-medium">PAID WITH GRATITUDE</span>
          <span class="w-8 h-0.5 bg-emerald-500"></span>
        </div>
      </div>
    </div>
  </div>
</div>
`;

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
