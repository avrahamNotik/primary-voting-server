import { Router } from "express";

import {
  createCandidateController,
  deleteCandidateController,
  getAllCandidatesController,
  getCandidateByIdController,
  rejectCandidateController,
  restoreCandidateController,
  updateCandidateController,
} from "../controllers/candidateController";

import { authMiddleware } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

router.get("/", getAllCandidatesController);

router.get("/:id", getCandidateByIdController);

router.post("/", authMiddleware, createCandidateController);

router.patch("/:id", authMiddleware, updateCandidateController);

router.patch(
  "/:id/reject",
  authMiddleware,
  requireRole("admin"),
  rejectCandidateController,
);

router.patch(
  "/:id/restore",
  authMiddleware,
  requireRole("admin"),
  restoreCandidateController,
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  deleteCandidateController,
);

export default router;
