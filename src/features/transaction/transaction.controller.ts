import { NextFunction, Request, Response } from "express";
import { sendSuccess, SuccessCode } from "../../shared/errorCode";
import logger from "../../shared/logger";
import { ZodError } from "zod";
import { ValidationError } from "../../shared/execeptions/ValidationError";
import { formatZodError } from "../../shared/helper";
import { InvoiceSchemaWithoutId } from "./transaction.schema";
import { transactionService } from "./transaction.service";

class TransactionController {
  async addNewSale(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const invoice = InvoiceSchemaWithoutId.parse(req.body);

      await transactionService.addSale(invoice);

      sendSuccess(
        res,
        {},
        "sale added successfully",
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
}

export const transactionController = new TransactionController();
