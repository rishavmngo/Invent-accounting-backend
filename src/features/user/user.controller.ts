import { Request, Response } from "express";
import { userService } from "./user.service";
import { sendSuccess, SuccessCode } from "../../shared/errorCode";
import { sanatizeUser } from "./user.dto";

class UserController {
  async getOne(req: Request, res: Response) {
    const id = req.params.id;
    const user = await userService.getUserById(id);

    sendSuccess(
      res,
      { user: sanatizeUser(user) },
      "user",
      SuccessCode.LOGIN_SUCCESS,
    );
  }

  async getAll(req: Request, res: Response) {
    const users = await userService.getAllUsers();

    res.json(users);
  }

  async getByEmail(req: Request, res: Response) {
    const users = await userService.getAllUsers();

    res.json(users);
  }
}

export const userController = new UserController();
