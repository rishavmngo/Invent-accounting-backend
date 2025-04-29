import { Request, Response } from "express";
import { Router } from "express";

import { authController } from "./auth.controller";
import passport from "passport";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Invent API: Route for authenticating users");
});

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/refresh", (req, res) => {
  // console.log(req.cookies.refreshToken);
  res.send("hello");
});
router.get(
  "/verify",
  passport.authenticate("jwt", { session: false }),
  authController.verify,
);

export default router;
