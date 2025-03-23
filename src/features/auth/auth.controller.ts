import { ConflictError, ValidationError } from "../../shared/customError.error";
import { userService } from "../user/user.service";
import {
  CredentialsSchema,
  Credential,
  RegistrationInfo,
  RegistrationSchema,
} from "./auth.schema";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    const registrationInfo: RegistrationInfo = req.body;

    try {
      const registerParseRes = RegistrationSchema.safeParse(registrationInfo);
      if (!registerParseRes.success) {
        next(new ValidationError(registerParseRes.error));
        return;
      }

      const existingUser = await userService.getUserByEmail(
        registerParseRes.data.email,
      );

      if (existingUser) {
        next(new ConflictError("User already exist!"));
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
      res.send("Registration successful");
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const credentials: Credential = req.body;

    try {
      const credResult = CredentialsSchema.safeParse(credentials);
      if (!credResult.success) {
        next(new ValidationError(credResult.error));
        return;
      }
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
