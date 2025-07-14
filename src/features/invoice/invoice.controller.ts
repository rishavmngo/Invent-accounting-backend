import { Request, Response } from "express";
import puppeteer from "puppeteer";
import { generateInvoiceHTML } from "./invoice.generator";
// import { data } from "../../shared/fakeData";
import { transactionService } from "../transaction/transaction.service";

class InvoiceController {
  async generate(req: Request, res: Response): Promise<void> {
    // const invoiceData = req.body;

    try {
      const data = await transactionService.getById(4, 2);
      console.log(data);

      const html = generateInvoiceHTML(data);
      const browser = await puppeteer.launch({ headless: false }); // set headless: false if debugging
      const page = await browser.newPage();

      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      await browser.close();

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice.pdf",
      });

      res.end(pdfBuffer);
    } catch (error) {
      console.error("PDF generation error:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  }
}

export const invoiceController = new InvoiceController();
