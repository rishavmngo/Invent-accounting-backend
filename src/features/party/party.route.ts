import { Request, Response, Router } from "express";
import { partyController } from "./party.controller";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Invent API (secure): Route for adding parties");
});

router.post("/add", partyController.addNewParty);
// router.post("/test", partyController.test);
router.post("/getAllPartiesCardData", partyController.getAllPartiesCardData);
router.post("/getById", partyController.getPartyById);
router.post("/delete", partyController.addNewParty);
router.post("/update", partyController.addNewParty);
router.post("/suggestions", partyController.suggestion);

export default router;
