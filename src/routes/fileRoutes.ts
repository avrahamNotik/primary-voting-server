import { Router } from "express";

import { uploadFileController } from "../controllers/fileController";
import { authMiddleware } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

router.post(
  "/party/image",
  authMiddleware,
  upload.single("partyImage"),
  uploadFileController,
);

router.post(
  "/party/platform",
  authMiddleware,
  upload.single("partyPlatform"),
  uploadFileController,
);

router.post(
  "/candidate/image",
  authMiddleware,
  upload.single("candidateImage"),
  uploadFileController,
);

router.post(
  "/candidate/platform",
  authMiddleware,
  upload.single("candidatePlatform"),
  uploadFileController,
);

export default router;
