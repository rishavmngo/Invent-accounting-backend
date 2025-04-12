import { Request, Response } from "express";
import { PartyFormSchema } from "./party.schema";
import logger from "../../shared/logger";
import {
  ErrorCode,
  sendError,
  sendSuccess,
  SuccessCode,
} from "../../shared/errorCode";
import { partyService } from "./party.service";

class PartyController {
  async addNewParty(req: Request, res: Response): Promise<void> {
    try {
      const partyFormParsedRes = PartyFormSchema.safeParse(req.body);

      if (!partyFormParsedRes.success) {
        logger.error(partyFormParsedRes);

        sendError(
          res,
          "Invalid credentials",
          ErrorCode.INVALID_CREDENTIALS,
          400,
        );
        return;
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
      sendError(
        res,
        "Unexpected Error occured!",
        ErrorCode.UNEXPECTED_ERROR,
        500,
      );
      return;
    }
  }
}

export const partyController = new PartyController();
