import { Router } from "express";

import {
  createPartyController,
  deletePartyController,
  getAllPartiesController,
  getPartyByIdController,
  updatePartyController,
} from "../controllers/partyController";

import { authMiddleware } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import { partyUpload } from "../middleware/partyUploadMiddleware";

const router = Router();

router.get("/", getAllPartiesController);

router.get("/:id", getPartyByIdController);

router.post("/", authMiddleware, partyUpload, createPartyController);

router.patch("/:id", authMiddleware, partyUpload, updatePartyController);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  deletePartyController,
);

export default router;
