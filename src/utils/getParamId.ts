import type { Request, Response } from "express";

export const getParamId = (req: Request, res: Response): string | null => {
  const { id } = req.params;

  if (typeof id !== "string") {
    res.status(400).json({
      success: false,
      message: "Invalid id",
    });

    return null;
  }

  return id;
};
