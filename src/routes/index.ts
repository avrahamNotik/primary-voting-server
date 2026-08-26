import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "API is working",
  });
});

export default router;
