import type { Request, Response } from "express";

import {
  createElection,
  deleteElection,
  getAllElections,
  getElectionById,
  updateElection,
} from "../services/electionService";

import { getParamId } from "../utils/getParamId";

export const getAllElectionsController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const elections = await getAllElections();

    res.status(200).json({
      success: true,
      elections,
    });
  } catch (error) {
    console.error("Get all elections error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getElectionByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = getParamId(req, res);

    if (!id) {
      return;
    }

    const election = await getElectionById(id);

    if (!election) {
      res.status(404).json({
        success: false,
        message: "Election not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      election,
    });
  } catch (error) {
    console.error("Get election error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createElectionController = async (req: Request, res: Response) => {
  try {
    const { partyId, startDate, endDate, maxCandidatesToSelect } = req.body;

    if (
      !partyId ||
      !startDate ||
      !endDate ||
      maxCandidatesToSelect === undefined
    ) {
      res.status(400).json({
        success: false,
        message:
          "partyId, startDate, endDate and maxCandidatesToSelect are required",
      });

      return;
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (
      Number.isNaN(parsedStartDate.getTime()) ||
      Number.isNaN(parsedEndDate.getTime())
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid startDate or endDate",
      });

      return;
    }

    if (parsedStartDate >= parsedEndDate) {
      res.status(400).json({
        success: false,
        message: "startDate must be before endDate",
      });

      return;
    }

    const election = await createElection({
      partyId,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      maxCandidatesToSelect: Number(maxCandidatesToSelect),
    });

    res.status(201).json({
      success: true,
      election,
    });
  } catch (error) {
    console.error("Create election error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateElectionController = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req, res);

    if (!id) {
      return;
    }

    const data: {
      partyId?: string;
      startDate?: Date;
      endDate?: Date;
      maxCandidatesToSelect?: number;
    } = {};

    const { partyId, startDate, endDate, maxCandidatesToSelect } = req.body;

    if (partyId !== undefined) {
      data.partyId = partyId;
    }

    if (startDate !== undefined) {
      const parsedStartDate = new Date(startDate);

      if (Number.isNaN(parsedStartDate.getTime())) {
        res.status(400).json({
          success: false,
          message: "Invalid startDate",
        });

        return;
      }

      data.startDate = parsedStartDate;
    }

    if (endDate !== undefined) {
      const parsedEndDate = new Date(endDate);

      if (Number.isNaN(parsedEndDate.getTime())) {
        res.status(400).json({
          success: false,
          message: "Invalid endDate",
        });

        return;
      }

      data.endDate = parsedEndDate;
    }

    if (maxCandidatesToSelect !== undefined) {
      const maxCandidates = Number(maxCandidatesToSelect);

      if (!Number.isInteger(maxCandidates) || maxCandidates < 1) {
        res.status(400).json({
          success: false,
          message: "maxCandidatesToSelect must be a positive integer",
        });

        return;
      }

      data.maxCandidatesToSelect = maxCandidates;
    }

    const election = await updateElection(id, data);

    if (!election) {
      res.status(404).json({
        success: false,
        message: "Election not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      election,
    });
  } catch (error) {
    console.error("Update election error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteElectionController = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req, res);

    if (!id) {
      return;
    }

    const election = await deleteElection(id);

    if (!election) {
      res.status(404).json({
        success: false,
        message: "Election not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "Election deleted successfully",
    });
  } catch (error) {
    console.error("Delete election error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
