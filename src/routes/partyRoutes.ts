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

const router = Router();

router.get("/", getAllPartiesController);

router.get("/:id", getPartyByIdController);

router.post("/", authMiddleware, requireRole("admin"), createPartyController);

router.patch(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  updatePartyController,
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  deletePartyController,
);

export default router;
