import { NextFunction, Request, Response } from "express";
import logger from "../../shared/logger";
import { settingService } from "./setting.service";
import { ErrorCode, sendSuccess, SuccessCode } from "../../shared/errorCode";
import { AppError } from "../../shared/appError.error";
import { ZodError } from "zod";
import { ValidationError } from "../../shared/execeptions/ValidationError";
import { formatZodError } from "../../shared/helper";
import { TemplateT, TemplateWithoutIdSchema } from "./setting.schema";
import { transactionService } from "../transaction/transaction.service";
import { generateInvoice } from "../invoice/invoice.generator";
import puppeteer from "puppeteer";

class SettingController {
  async getAllTemplates(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const templates = await settingService.getAllTemplate();

      sendSuccess(
        res,
        templates,
        "Templates fetched sucessfull",
        SuccessCode.LOGIN_SUCCESS,
      );
      return;
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  async getTemplateById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.body;

    try {
      if (!id) {
        throw new AppError(
          "missing fields: id",
          402,
          ErrorCode.VALIDATION_ERROR,
        );
      }

      const templates = await settingService.getTemplateById(id);

      sendSuccess(
        res,
        templates,
        "Template fetched sucessfull",
        SuccessCode.LOGIN_SUCCESS,
      );
      return;
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  async getByOwnerId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        throw new AppError("Missing field: user_id");
      }

      const settings = await settingService.getByOwnerId(user_id);

      sendSuccess(
        res,
        settings,
        "Settings fetched sucessfully",
        SuccessCode.LOGIN_SUCCESS,
      );
      return;
    } catch (error) {
      logger.error(error);
      if (error instanceof ZodError) {
        next(new ValidationError(formatZodError(error)));
      } else {
        next(error);
      }
    }
  }
  async addTemplate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const template = TemplateWithoutIdSchema.parse(req.body);

      const id = await settingService.addTemplate(template);

      sendSuccess(
        res,
        { id: id },
        "Template added sucessfull",
        SuccessCode.LOGIN_SUCCESS,
      );
      return;
    } catch (error) {
      logger.error(error);
      if (error instanceof ZodError) {
        next(new ValidationError(formatZodError(error)));
      } else {
        next(error);
      }
    }
  }

  async generate(req: Request, res: Response): Promise<void> {
    const { user_id, invoice_id } = req.body;

    try {
      if (!user_id || !invoice_id) {
        throw new AppError("Missing important fields");
      }
      const invoice = await transactionService.getById(user_id, invoice_id);

      const templateData = (await settingService.getTemplateById(
        3,
      )) as TemplateT;

      // console.log(templateData);

      const html = generateInvoice(invoice, templateData.template);
      const browser = await puppeteer.launch({ headless: true }); // set headless: false if debugging
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

export const settingController = new SettingController();
