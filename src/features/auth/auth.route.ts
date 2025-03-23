import express, { Request, Response } from "express";
import { authController } from "./auth.controller";

const router = express();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

router.post("/register", authController.register);
router.get("/login", authController.login);

export default router;
