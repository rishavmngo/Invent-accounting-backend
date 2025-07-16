import { Request, Response, Router } from "express";
import { settingController } from "./setting.controller";
import multer from "multer";
import path from "path";
import { AppError } from "../../shared/appError.error";
import logger from "../../shared/logger";
import { settingService } from "./setting.service";

const router = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
router.get("/", (req: Request, res: Response) => {
  res.send("Invent API (secure): Route for manage settings");
});

router.post("/upload-logo", upload.single("logo"), async (req, res, next) => {
  try {
    const file = req.file;
    const { user_id } = req.body;
    console.log("here", user_id);
    if (!user_id) {
      throw new AppError("Error occured while uploading");
    }
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const imageUrl = `/uploads/${file.filename}`;
    await settingService.uploadLogoTemp(parseInt(user_id, 10), imageUrl);

    res.status(200).json({ url: imageUrl });
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

router.post("/getByOwnerId", settingController.getByOwnerId);

router.post("/template/add", settingController.addTemplate);
router.post("/template/getAll", settingController.getAllTemplates);
router.post("/template/getById", settingController.getTemplateById);
router.post("/template/generate", settingController.generate);

export default router;
