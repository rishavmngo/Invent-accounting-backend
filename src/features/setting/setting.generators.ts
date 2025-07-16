import puppeteer from "puppeteer";
import { generateInvoice } from "../invoice/invoice.generator";
import { data } from "../../shared/fakeData";
import { TemplateT } from "./setting.schema";
import path from "path";
import fs from "fs";

export async function generateInvoiceThumnail(templateData: TemplateT) {
  const html = generateInvoice(data, templateData.template);

  const browser = await puppeteer.launch({ headless: true }); // or `true`
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  // Optional: Set the viewport if your template has a specific width
  await page.setViewport({
    width: 800,
    height: 1120, // roughly A4 ratio
    deviceScaleFactor: 4, // increase for higher quality
  });

  // Take screenshot
  const screenshotBuffer = await page.screenshot({
    type: "png",
    fullPage: true, // Set to false if you want just the visible part
    omitBackground: false, // Ensures background is captured if it's white
    encoding: "binary", // returns a Buffer
  });

  // Save to file system if needed
  const fileName = `template_thumbnail_${Date.now()}.png`;
  const filePath = path.join(process.cwd(), "public/uploads", fileName);
  fs.writeFileSync(filePath, screenshotBuffer);

  // Cleanup
  await browser.close();
  const thumbnailPath = `/uploads/${fileName}`;

  return thumbnailPath;
}
