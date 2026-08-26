import type { Request, Response } from "express";

import { db } from "../db";

export const healthController = async (_req: Request, res: Response) => {
  try {
    await db.execute("SELECT 1");

    res.status(200).json({
      success: true,
      message: "Server and database are running",
    });
  } catch (error) {
    console.error("Health check failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
};
