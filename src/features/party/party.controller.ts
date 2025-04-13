import { NextFunction, Request, Response } from "express";
import { PartyFormSchema } from "./party.schema";
import logger from "../../shared/logger";
import { sendSuccess, SuccessCode } from "../../shared/errorCode";
import { partyService } from "./party.service";
import { ValidationError } from "../../shared/execeptions/ValidationError";
import { ZodError } from "zod";
import { formatZodError } from "../../shared/helper";

class PartyController {
  async addNewParty(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const partyFormData = PartyFormSchema.parse(req.body);

      const partyId = await partyService.add(partyFormData);

      sendSuccess(
        res,
        { id: partyId },
        "Party added successfully",
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

export const partyController = new PartyController();
