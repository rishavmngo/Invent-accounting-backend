import { userService } from "../user/user.service";
import {
  CredentialsSchema,
  Credential,
  RegistrationInfo,
  RegistrationSchema,
} from "./auth.schema";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  ErrorCode,
  sendError,
  sendSuccess,
  SuccessCode,
} from "../../shared/errorCode";

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const registrationInfo: RegistrationInfo = req.body;

    try {
      const registerParseRes = RegistrationSchema.safeParse(registrationInfo);
      if (!registerParseRes.success) {
        sendError(
          res,
          "Invalid credentials",
          ErrorCode.INVALID_CREDENTIALS,
          400,
        );
        return;
      }

      const existingUser = await userService.getUserByEmail(
        registerParseRes.data.email,
      );

      if (existingUser) {
        sendError(
          res,
          "User already exists!",
          ErrorCode.USER_ALREADY_EXIST,
          409,
        );
        return;
      }

      const hashedPassword = await bcrypt.hash(
        registerParseRes.data.password,
        10,
      );

      const userWithHashedPassword = {
        ...registerParseRes.data,
        password: hashedPassword,
      };

      await userService.addUser(userWithHashedPassword);
      sendSuccess(
        res,
        null,
        "Registration Successful",
        SuccessCode.REGISTRATION_SUCCESS,
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

  async login(req: Request, res: Response): Promise<void> {
    const credentials: Credential = req.body;

    try {
      const credResult = CredentialsSchema.safeParse(credentials);
      if (!credResult.success) {
        sendError(
          res,
          "Invalid credentials",
          ErrorCode.INVALID_CREDENTIALS,
          400,
        );
        return;
      }

      const user = await userService.getUserByEmail(credResult.data.email);
      if (!user) {
        sendError(res, "Wrong credentails!", ErrorCode.WRONG_CREDENTIALS, 401);
        return;
      }

      const passwordMatched = bcrypt.compare(
        credResult.data.email,
        user.password,
      );

      if (!passwordMatched) {
        sendError(res, "Wrong credentails!", ErrorCode.WRONG_CREDENTIALS, 401);
        return;
      }

      sendSuccess(res, null, "Logined successful!", SuccessCode.LOGIN_SUCCESS);
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

export const authController = new AuthController();
