import { NextFunction, Request, Response } from "express";
import { ItemFormSchema } from "./inventory.schema";
import { ValidationError } from "../../shared/execeptions/ValidationError";
import { formatZodError } from "../../shared/helper";
import { ZodError } from "zod";
import { inventoryService } from "./inventory.service";
import { sendSuccess, SuccessCode } from "../../shared/errorCode";

class InventoryController {
  async addNewItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const itemFormData = ItemFormSchema.parse(req.body);

      await inventoryService.add(itemFormData);

      sendSuccess(
        res,
        {},
        "Item added successfully!!",
        SuccessCode.LOGIN_SUCCESS,
      );
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError(formatZodError(error)));
      } else {
        next(error);
      }
    }
  }
}

export const inventoryController = new InventoryController();
