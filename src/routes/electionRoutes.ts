import { Router } from "express";

import {
  createElectionController,
  deleteElectionController,
  getAllElectionsController,
  getElectionByIdController,
  updateElectionController,
} from "../controllers/electionController";

import { authMiddleware } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

router.get("/", getAllElectionsController);

router.get("/:id", getElectionByIdController);

router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  createElectionController,
);

router.patch(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  updateElectionController,
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  deleteElectionController,
);

export default router;
