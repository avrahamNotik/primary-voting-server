import { Router } from "express";

import healthRoutes from "./healthRoutes";
import userRoutes from "./userRoutes";
import partyRoutes from "./partyRoutes";

const router = Router();

router.use("/health", healthRoutes);

router.use("/users", userRoutes);

router.use("/parties", partyRoutes);

export default router;
