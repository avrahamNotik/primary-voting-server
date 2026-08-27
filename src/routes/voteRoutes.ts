import { Router } from "express";

import { submitVoteController } from "../controllers/voteController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, submitVoteController);

export default router;
