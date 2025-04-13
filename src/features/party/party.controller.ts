import { NextFunction, Request, Response } from "express";
import { PartyFormSchema } from "./party.schema";
import logger from "../../shared/logger";
import { ErrorCode, sendSuccess, SuccessCode } from "../../shared/errorCode";
import { partyService } from "./party.service";
import { AppError } from "../../shared/appError.error";

class PartyController {
  async addNewParty(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const partyFormParsedRes = PartyFormSchema.safeParse(req.body);

      if (!partyFormParsedRes.success) {
        logger.error(partyFormParsedRes);

        throw new AppError(
          "Invalid credentials",
          400,
          ErrorCode.INVALID_CREDENTIALS,
        );
      }
      const partyId = await partyService.add(partyFormParsedRes.data);

      sendSuccess(
        res,
        { id: partyId },
        "Party added successfully",
        SuccessCode.LOGIN_SUCCESS,
      );
      return;
    } catch (error) {
      console.log(error);
      logger.error(error);
      next(error);
    }
  }
}

export const partyController = new PartyController();
