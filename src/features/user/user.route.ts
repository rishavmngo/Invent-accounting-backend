import express from "express";
import { userController } from "./user.controller";

const userRoute = express();

userRoute.get("/:id", userController.getOne);

export default userRoute;
