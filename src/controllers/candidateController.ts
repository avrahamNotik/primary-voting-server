import type { Request, Response } from "express";

import {
  createCandidate,
  deleteCandidate,
  getAllCandidates,
  getCandidateById,
  rejectCandidate,
  restoreCandidate,
  updateCandidate,
} from "../services/candidateService";

import { getParamId } from "../utils/getParamId";

export const getAllCandidatesController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const candidates = await getAllCandidates();

    res.status(200).json({
      success: true,
      candidates,
    });
  } catch (error) {
    console.error("Get all candidates error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCandidateByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
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

    res.status(200).json({
      success: true,
      candidate,
    });
  } catch (error) {
    console.error("Get candidate error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createCandidateController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId, partyId, slogan, description, imageUrl, platformPdfUrl } =
      req.body ?? {};

    if (!userId || !partyId || !slogan || !description) {
      res.status(400).json({
        success: false,
        message: "userId, partyId, slogan and description are required",
      });

      return;
    }

    const candidate = await createCandidate({
      userId,
      partyId,
      slogan,
      description,
      imageUrl,
      platformPdfUrl,
    });

    res.status(201).json({
      success: true,
      candidate,
    });
  } catch (error) {
    console.error("Create candidate error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateCandidateController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = getParamId(req, res);

    if (!id) {
      return;
    }

    const { slogan, description, imageUrl, platformPdfUrl } = req.body ?? {};

    const candidate = await updateCandidate(id, {
      slogan,
      description,
      imageUrl,
      platformPdfUrl,
    });

    if (!candidate) {
      res.status(404).json({
        success: false,
        message: "Candidate not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      candidate,
    });
  } catch (error) {
    console.error("Update candidate error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const rejectCandidateController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = getParamId(req, res);

    if (!id) {
      return;
    }

    const candidate = await rejectCandidate(id);

    if (!candidate) {
      res.status(404).json({
        success: false,
        message: "Candidate not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      candidate,
    });
  } catch (error) {
    console.error("Reject candidate error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const restoreCandidateController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = getParamId(req, res);

    if (!id) {
      return;
    }

    const candidate = await restoreCandidate(id);

    if (!candidate) {
      res.status(404).json({
        success: false,
        message: "Candidate not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      candidate,
    });
  } catch (error) {
    console.error("Restore candidate error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteCandidateController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = getParamId(req, res);

    if (!id) {
      return;
    }

    const candidate = await deleteCandidate(id);

    if (!candidate) {
      res.status(404).json({
        success: false,
        message: "Candidate not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Candidate deleted successfully",
    });
  } catch (error) {
    console.error("Delete candidate error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
