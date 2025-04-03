import { Router } from "express";
import { userController } from "./user.controller";

const userRoute = Router();

userRoute.get("/:id", userController.getOne);

export default userRoute;
