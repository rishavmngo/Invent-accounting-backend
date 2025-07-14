import { Request, Response, Router } from "express";
import { invoiceController } from "./invoice.controller";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Invent API (secure): Route for generating invoices");
});
router.post("/generate", invoiceController.generate);

export default router;
