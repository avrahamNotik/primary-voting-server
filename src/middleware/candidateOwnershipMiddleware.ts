import type { NextFunction, Request, Response } from "express";

import { getCandidateById } from "../services/candidateService";
import { getParamId } from "../utils/getParamId";

export const candidateOwnershipMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    if (req.user.role === "admin") {
      next();

      return;
    }

    if (req.user.role !== "candidate") {
      res.status(403).json({
        success: false,
        message: "Only candidates can update their own profile",
      });

      return;
    }

    const id = getParamId(req, res);

    if (!id) {
      return;
    }

    const candidate = await getCandidateById(id);

    if (!candidate) {
      res.status(404).json({
        success: false,
        message: "Candidate not found",
      });

      return;
    }

    if (candidate.userId !== req.user.userId) {
      res.status(403).json({
        success: false,
        message: "You can only update your own candidate profile",
      });

      return;
    }

    next();
  } catch (error) {
    console.error("Candidate ownership error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
