import type { Request, Response } from "express";

import { submitVote } from "../services/voteService";

export const submitVoteController = async (req: Request, res: Response) => {
  try {
    const { electionId, candidateIds } = req.body ?? {};

    if (!electionId || !Array.isArray(candidateIds)) {
      res.status(400).json({
        success: false,
        message: "electionId and candidateIds are required",
      });

      return;
    }

    const voterId = req.user?.userId;

    if (!voterId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    await submitVote(electionId, voterId, candidateIds);

    res.status(201).json({
      success: true,
      message: "Vote submitted successfully",
    });
  } catch (error) {
    console.error("Submit vote error:", error);

    if (error instanceof Error) {
      switch (error.message) {
        case "ELECTION_NOT_FOUND":
          res.status(404).json({
            success: false,
            message: "Election not found",
          });
          return;

        case "ELECTION_NOT_ACTIVE":
          res.status(400).json({
            success: false,
            message: "Election is not active",
          });
          return;

        case "VOTER_NOT_ELIGIBLE":
          res.status(403).json({
            success: false,
            message: "User is not eligible to vote",
          });
          return;

        case "ALREADY_VOTED":
          res.status(409).json({
            success: false,
            message: "User has already voted",
          });
          return;

        case "NO_CANDIDATES_SELECTED":
          res.status(400).json({
            success: false,
            message: "At least one candidate must be selected",
          });
          return;

        case "TOO_MANY_CANDIDATES":
          res.status(400).json({
            success: false,
            message: "Too many candidates selected",
          });
          return;

        case "DUPLICATE_CANDIDATES":
          res.status(400).json({
            success: false,
            message: "Duplicate candidates are not allowed",
          });
          return;

        case "INVALID_CANDIDATES":
          res.status(400).json({
            success: false,
            message: "One or more selected candidates are invalid",
          });
          return;
      }
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
