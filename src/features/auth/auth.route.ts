import { Request, Response } from "express";
import { Router } from "express";

import { authController } from "./auth.controller";
import passport from "passport";
import { generateInvoiceHTML } from "../invoice/invoice.generator";
import { data } from "../../shared/fakeData";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Invent API: Route for authenticating users");
});

router.get("/preview", (req, res) => {
  const html = generateInvoiceHTML(data);
  res.send(html);
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
