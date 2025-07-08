import { NextFunction, Request, Response } from "express";
import { ItemFormSchema } from "./inventory.schema";
import { ValidationError } from "../../shared/execeptions/ValidationError";
import { formatZodError } from "../../shared/helper";
import { z, ZodError } from "zod";
import { inventoryService } from "./inventory.service";
import { ErrorCode, sendSuccess, SuccessCode } from "../../shared/errorCode";
import logger from "../../shared/logger";
import { AppError } from "../../shared/appError.error";

class InventoryController {
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.body;
      if (!id) {
        throw new AppError(
          "Missing id of the item",
          400,
          ErrorCode.VALIDATION_ERROR,
        );
      }
      await inventoryService.delete(id);
      sendSuccess(
        res,
        {},
        "Successfully delete item",
        SuccessCode.LOGIN_SUCCESS,
      );
      return;
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  async getItemById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { user_id, item_id } = req.body;
      if (!user_id || !item_id) {
        throw new AppError(
          "Missing id of the item",
          400,
          ErrorCode.VALIDATION_ERROR,
        );
      }
      const item = await inventoryService.getById(user_id, item_id);

      if (!item) {
        throw new AppError(
          `Item with id: ${item_id} not found`,
          404,
          ErrorCode.NOT_FOUND,
        );
      }

      sendSuccess(
        res,
        item,
        "Successfully fetched item by id",
        SuccessCode.LOGIN_SUCCESS,
      );
      return;
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  async updateItem(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log("before", req.body);
      const itemFormData = ItemFormSchema.extend({ id: z.number() }).parse(
        req.body,
      );

      const { id, ...item } = itemFormData;

      console.log("after", item);
      await inventoryService.update(id, item);

      sendSuccess(
        res,
        {},
        "Item updated successfully!!",
        SuccessCode.LOGIN_SUCCESS,
      );
    } catch (error) {
      logger.error(error);
      if (error instanceof ZodError) {
        next(new ValidationError(formatZodError(error)));
      } else {
        next(error);
      }
    }
  }
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

  async getAllCardData(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { user_id } = req.body;

      if (!user_id) {
        throw new AppError(
          "Missing field: user_id",
          400,
          ErrorCode.CONFLICT_ERROR,
        );
      }

      const items = await inventoryService.getAllCardData(user_id);

      sendSuccess(
        res,
        items,
        "Items fetched successfully!",
        SuccessCode.LOGIN_SUCCESS,
      );
      return;
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }
}

export const inventoryController = new InventoryController();
