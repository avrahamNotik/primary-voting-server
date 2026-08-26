import { Router } from "express";

import healthRoutes from "./healthRoutes";
import userRoutes from "./userRoutes";
import partyRoutes from "./partyRoutes";
import electionRoutes from "./electionRoutes";
import candidateRoutes from "./candidateRoutes";

const router = Router();

router.use("/health", healthRoutes);

router.use("/users", userRoutes);

router.use("/parties", partyRoutes);

router.use("/elections", electionRoutes);

router.use("/candidates", candidateRoutes);

export default router;
