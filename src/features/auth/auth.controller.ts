import { userService } from "../user/user.service";
import {
  CredentialsSchema,
  Credential,
  RegistrationInfo,
  RegistrationSchema,
} from "./auth.schema";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { ErrorCode, sendSuccess, SuccessCode } from "../../shared/errorCode";
import { jwtService } from "../../shared/jwt";
import logger from "../../shared/logger";
import { AuthError } from "../../shared/execeptions/AuthError";
import { ConflictError } from "../../shared/execeptions/ConflictError";
import { AppError } from "../../shared/appError.error";

class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const registrationInfo: RegistrationInfo = req.body;

    try {
      const registerParseRes = RegistrationSchema.safeParse(registrationInfo);
      if (!registerParseRes.success) {
        logger.error(registerParseRes);
        throw new AuthError("Invalid credentials");
      }

      const existingUser = await userService.getUserByEmail(
        registerParseRes.data.email,
      );

      if (existingUser) {
        throw new ConflictError("User already exists!");
      }

      const hashedPassword = await bcrypt.hash(
        registerParseRes.data.password,
        10,
      );

      const userWithHashedPassword = {
        ...registerParseRes.data,
        password: hashedPassword,
      };

      const user = await userService.addUser(userWithHashedPassword);

      const accessToken = jwtService.generateAccessToken(user.id);
      sendSuccess(
        res,
        { token: accessToken },
        "Registration Successful",
        SuccessCode.REGISTRATION_SUCCESS,
      );
      return;
    } catch (error) {
      logger.error(error);
      next(error);
      return;
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const credentials: Credential = req.body;

    try {
      const credResult = CredentialsSchema.safeParse(credentials);
      if (!credResult.success) {
        throw new AuthError("Invalid credentials");
      }

      const user = await userService.getUserByEmail(credResult.data.email);
      if (!user) {
        throw new AppError(
          "Wrong credentails",
          401,
          ErrorCode.WRONG_CREDENTIALS,
        );
      }

      const passwordMatched = bcrypt.compare(
        credResult.data.email,
        user.password,
      );

      if (!passwordMatched) {
        throw new AppError(
          "Wrong credentails",
          401,
          ErrorCode.WRONG_CREDENTIALS,
        );
      }

      const accessToken = jwtService.generateAccessToken(user.id);
      // const refreshToken = jwtService.generateRefreshToken(user.id);

      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "strict",
      //   path: "/api/auth/refresh",
      // });

      sendSuccess(
        res,
        { token: accessToken },
        "Logined successful!",
        SuccessCode.LOGIN_SUCCESS,
      );
      return;
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }

  async verify(req: Request, res: Response): Promise<void> {
    sendSuccess(
      res,
      { user: req.user },
      "Token verified!",
      SuccessCode.LOGIN_SUCCESS,
    );
    return;
  }
}

export const authController = new AuthController();
