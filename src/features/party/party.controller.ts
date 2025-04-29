import { NextFunction, Request, Response } from "express";
import { PartyFormSchema } from "./party.schema";
import logger from "../../shared/logger";
import { ErrorCode, sendSuccess, SuccessCode } from "../../shared/errorCode";
import { partyService } from "./party.service";
import { ValidationError } from "../../shared/execeptions/ValidationError";
import { ZodError } from "zod";
import { formatZodError } from "../../shared/helper";
import { AppError } from "../../shared/appError.error";

class PartyController {
  async getPartyById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { user_id, party_id } = req.body;

      if (!user_id || !party_id) {
        throw new AppError("Missing field: id", 400, ErrorCode.CONFLICT_ERROR);
      }

      const party = await partyService.getById(user_id, party_id);

      sendSuccess(
        res,
        party,
        "Successfully fetched party by id",
        SuccessCode.LOGIN_SUCCESS,
      );
      return;
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  async addNewParty(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const partyFormData = PartyFormSchema.parse(req.body);

      // This user_id need to check the user_id must equal to user_id in token

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

  async getAllPartiesCardData(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { user_id } = req.body;

      //if ther user_id is sent by admin

      if (!user_id) {
        throw new AppError(
          "Missing field: user_id",
          400,
          ErrorCode.CONFLICT_ERROR,
        );
      }

      const cardDatas = await partyService.getAllPartyCard(user_id);

      sendSuccess(
        res,
        cardDatas,
        "Parties card data fetched successfully",
        SuccessCode.LOGIN_SUCCESS,
      );
      return;
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }
}

export const partyController = new PartyController();
