import type { Request, Response } from "express";

import {
  createParty,
  deleteParty,
  getAllParties,
  getPartyById,
  updateParty,
} from "../services/partyService";
import { getParamId } from "../utils/getParamId";

export const getAllPartiesController = async (_req: Request, res: Response) => {
  try {
    const parties = await getAllParties();

    res.status(200).json({
      success: true,
      parties,
    });
  } catch (error) {
    console.error("Get all parties error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getPartyByIdController = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req, res);

    if (!id) return;

    const party = await getPartyById(id);

    if (!party) {
      res.status(404).json({
        success: false,
        message: "Party not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      party,
    });
  } catch (error) {
    console.error("Get party error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createPartyController = async (req: Request, res: Response) => {
  try {
    const { name, slogan, description, imageUrl, platformPdfUrl } = req.body;

    if (!name || !slogan || !description) {
      res.status(400).json({
        success: false,
        message: "Name, slogan and description are required",
      });

      return;
    }

    const party = await createParty({
      name,
      slogan,
      description,
      imageUrl,
      platformPdfUrl,
    });

    res.status(201).json({
      success: true,
      party,
    });
  } catch (error) {
    console.error("Create party error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updatePartyController = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req, res);

    if (!id) return;

    const party = await updateParty(id, req.body);

    if (!party) {
      res.status(404).json({
        success: false,
        message: "Party not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      party,
    });
  } catch (error) {
    console.error("Update party error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deletePartyController = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req, res);

    if (!id) return;

    const party = await deleteParty(id);

    if (!party) {
      res.status(404).json({
        success: false,
        message: "Party not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Party deleted successfully",
    });
  } catch (error) {
    console.error("Delete party error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
