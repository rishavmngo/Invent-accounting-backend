import { Router } from "express";
import { inventoryController } from "./inventory.controller";

const router = Router();

router.post("/add", inventoryController.addNewItem);

export default router;
