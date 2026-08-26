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
import { candidateUpload } from "../middleware/candidateUploadMiddleware";
import { candidateOwnershipMiddleware } from "../middleware/candidateOwnershipMiddleware";

const router = Router();

router.get("/", getAllCandidatesController);

router.get("/:id", getCandidateByIdController);

router.post("/", authMiddleware, candidateUpload, createCandidateController);

router.patch(
  "/:id",
  authMiddleware,
  candidateOwnershipMiddleware,
  candidateUpload,
  updateCandidateController,
);

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
