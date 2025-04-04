import { Request, Response } from "express";
import { Router } from "express";

import { authController } from "./auth.controller";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/refresh", (req, res) => {
  console.log(req.cookies);
  // console.log(req.cookies.refreshToken);
  res.send("hello");
});

export default router;
