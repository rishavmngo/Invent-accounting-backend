import { Router } from "express";
import { inventoryController } from "./inventory.controller";

const router = Router();

router.post("/add", inventoryController.addNewItem);
router.post("/getAllCardData", inventoryController.getAllCardData);
router.post("/getById", inventoryController.getItemById);

export default router;
