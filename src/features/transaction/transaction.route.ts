import { Request, Response, Router } from "express";
import { transactionController } from "./transaction.controller";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Invent API (secure): Route for adding transaction");
});

router.post("/getAll", transactionController.getAll);
router.post("/sale/add", transactionController.addNewSale);

export default router;
