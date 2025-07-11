import { Router } from "express";
import { inventoryController } from "./inventory.controller";

const router = Router();

router.post("/add", inventoryController.addNewItem);
router.post("/getAllCardData", inventoryController.getAllCardData);
router.post("/getById", inventoryController.getItemById);
router.post("/update", inventoryController.updateItem);
router.post("/delete", inventoryController.delete);
router.post("/adjustStock", inventoryController.adjustStock);
router.post("/deleteStock", inventoryController.deleteStock);
router.post("/getAllStocks", inventoryController.getAllStocks);
export default router;
