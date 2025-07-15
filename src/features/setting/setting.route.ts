import { Request, Response, Router } from "express";
import { settingController } from "./setting.controller";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Invent API (secure): Route for manage settings");
});

router.post("/template/add", settingController.addTemplate);
router.post("/template/getAll", settingController.getAllTemplates);
router.post("/template/getById", settingController.getTemplateById);
router.post("/template/generate", settingController.generate);

export default router;
